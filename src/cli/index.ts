import { Command } from 'commander';
import { createInterface } from 'readline';
import ora from 'ora';
import chalk from 'chalk';
import { error } from './logger.js';
import { EnhanceError } from './errors.js';
import { loadConfig } from '../config/index.js';
import { scanProject } from '../scanner/index.js';
import { getCached, setCached } from '../cache/index.js';
import { analyzeIntent } from '../analyzer/intent.js';
import { findRelevantFiles, findProjectInstructions } from '../analyzer/context.js';
import { enhance } from '../enhancer/index.js';
import { decomposeToPlan } from '../enhancer/planner.js';
import { getProvider } from '../providers/index.js';
import { runSetup } from './setup.js';
import type { Intent } from '../types.js';

const program = new Command();

program
  .name('enhance')
  .description('AI prompt middleware — upgrades vague prompts into production-quality AI instructions')
  .version('0.1.0');

// ── setup ──────────────────────────────────────────────────────────────────
program
  .command('setup')
  .description('Install the /enhance slash command for Claude Code, OpenCode, and Codex CLI')
  .option('--force', 'Overwrite existing installations')
  .option('--all', 'Install for all supported tools even if not detected in PATH')
  .action(async (opts: { force: boolean; all: boolean }) => {
    await runSetup(opts);
  });

// ── enhance (default) ──────────────────────────────────────────────────────
program
  .argument('[prompt]', 'Prompt to enhance and send to AI')
  .addHelpText('after', `
Examples:
  enhance "build a login page"
  enhance "fix the auth bug" --dry-run
  enhance "create dashboard" --confirm --verbose
  enhance "refactor user service" --provider codex
  enhance "add auth" --action add --feature auth
  enhance "add payments" --iteration 1`)
  .option('-p, --provider <name>', 'AI provider: claude | codex | opencode')
  .option('--dry-run', 'Print enhanced prompt without sending to AI')
  .option('--print-prompt', 'Print enhanced prompt before sending to AI')
  .option('--preview', 'Color-coded prompt preview with per-section token counts')
  .option('--verbose', 'Show detected stack, intent, and context stats')
  .option('--confirm', 'Show detected intent and ask for approval before enhancing')
  .option('--plan', 'Decompose complex task into sequential sub-prompts (uses AI)')
  .option('--iteration <n>', 'Angle iteration: 0=completeness, 1=production, 2=dx, 3=alternative', '0')
  .option('--action <action>', 'Override detected action (create|fix|refactor|explain|add|delete)')
  .option('--entity <entity>', 'Override detected entity (page|component|api|hook|util|config|style)')
  .option('--feature <feature>', 'Override detected feature (auth|payment|user|upload|...)')
  .action(async (rawPrompt: string | undefined, opts: {
    provider?: string;
    dryRun: boolean;
    printPrompt: boolean;
    preview: boolean;
    verbose: boolean;
    confirm: boolean;
    plan: boolean;
    iteration: string;
    action?: string;
    entity?: string;
    feature?: string;
  }) => {
    if (!rawPrompt) {
      program.help();
      return;
    }

    const cwd = process.cwd();
    const spinner = ora();

    try {
      spinner.start('Loading config...');
      const config = await loadConfig(cwd);
      if (opts.provider) config.provider = opts.provider as 'claude' | 'codex' | 'opencode';

      spinner.text = 'Scanning project...';
      let scan = await getCached(cwd);
      if (!scan) {
        scan = await scanProject(cwd);
        await setCached(cwd, scan);
      }

      spinner.text = 'Analyzing intent...';
      let intent = analyzeIntent(rawPrompt);

      // Apply manual overrides
      if (opts.action) intent = { ...intent, action: opts.action as Intent['action'] };
      if (opts.entity) intent = { ...intent, entity: opts.entity as Intent['entity'] };
      if (opts.feature) intent = { ...intent, feature: opts.feature };

      // --plan: decompose into sequential sub-prompts
      if (opts.plan) {
        if (!config.apiKey) {
          error('ANTHROPIC_API_KEY required for --plan');
          process.exit(1);
        }
        spinner.text = 'Decomposing task into steps...';
        const plan = await decomposeToPlan(rawPrompt, intent, scan.stack, config.apiKey);
        spinner.stop();
        console.log('\n' + chalk.bold(`Implementation Plan (${plan.steps.length} steps)\n`));
        for (const step of plan.steps) {
          console.log(chalk.cyan(`Step ${step.step}: ${step.title}`));
          if (step.dependsOn.length > 0) {
            console.log(chalk.dim(`  Depends on: Step ${step.dependsOn.join(', ')}`));
          }
          console.log(chalk.dim('─'.repeat(60)));
          console.log(step.prompt);
          console.log();
        }
        process.exit(0);
      }

      // --confirm: show intent and ask for approval
      if (opts.confirm) {
        spinner.stop();
        printIntentSummary(intent);
        const approved = await confirmPrompt('Proceed with this intent? [Y/n] ');
        if (!approved) {
          console.log(chalk.yellow('\nAborted. Use --action / --entity / --feature to override detection.\n'));
          process.exit(0);
        }
        spinner.start('Optimizing context...');
      }

      if (opts.verbose) {
        spinner.stop();
        console.log('\nStack detected:', JSON.stringify(scan.stack, null, 2));
        console.log('\nIntent:', JSON.stringify(intent, null, 2));
        spinner.start('Optimizing context...');
      }

      spinner.text = 'Optimizing context...';
      const [{ contextFiles, gitContext }, projectInstructions] = await Promise.all([
        findRelevantFiles(cwd, intent, scan.structure, config.maxContextTokens, config.alwaysInclude ?? []),
        findProjectInstructions(cwd),
      ]);

      if (opts.verbose) {
        spinner.stop();
        if (projectInstructions) console.log(chalk.dim('  Project instructions: found (CLAUDE.md / AGENTS.md)'));
        if (gitContext) console.log(chalk.dim('  Git context: recent changes detected'));
        spinner.start('Enhancing prompt...');
      }

      spinner.text = 'Enhancing prompt...';
      const iteration = Math.max(0, parseInt(opts.iteration ?? '0', 10) || 0);
      const enhanced = await enhance(rawPrompt, scan, contextFiles, projectInstructions, gitContext, intent, config, iteration);

      spinner.stop();

      if (enhanced.angle) {
        console.log(chalk.dim(`\n  📍 v${iteration + 1} — ${enhanced.angle} angle\n`));
      }

      if (opts.preview) {
        printColoredPreview(enhanced.enhanced);
        if (opts.dryRun) process.exit(0);
        const go = await confirmPrompt('Send to AI? [Y/n] ');
        if (!go) process.exit(0);
        spinner.start(`Sending to AI...`);
      } else if (opts.dryRun || opts.printPrompt) {
        console.log('\n─── Enhanced Prompt ─────────────────────────────────\n');
        console.log(enhanced.enhanced);
        console.log('\n─────────────────────────────────────────────────────\n');
      }

      if (opts.dryRun) {
        process.exit(0);
      }

      const provider = getProvider(config);
      console.log(`\n[${provider.name}]\n`);
      await provider.send(enhanced.enhanced, {
        complexity: enhanced.intent.complexity,
        onUsage: (usage: { inputTokens: number; outputTokens: number; model: string }) => {
          const cost = estimateCost(usage.model, usage.inputTokens, usage.outputTokens);
          console.log(chalk.dim(`\n  Tokens: ${usage.inputTokens} in / ${usage.outputTokens} out · ~$${cost}`));
        },
      });

    } catch (err) {
      spinner.stop();
      if (err instanceof EnhanceError) {
        error(err.message);
        if (err.code === 'MISSING_API_KEY') {
          console.error('\nSet your API key: export ANTHROPIC_API_KEY=sk-...\n');
        }
        process.exit(1);
      }
      error('Unexpected error', err);
      process.exit(1);
    }
  });

program.parse();

function printIntentSummary(intent: Intent): void {
  const confidencePct = Math.round(intent.confidence * 100);
  const confidenceColor = intent.confidence >= 0.6 ? chalk.green : intent.confidence >= 0.3 ? chalk.yellow : chalk.red;

  console.log('\n' + chalk.bold('Detected Intent:'));
  console.log(`  ${chalk.cyan('Action')}:     ${intent.action}`);
  console.log(`  ${chalk.cyan('Entity')}:     ${intent.entity}`);
  console.log(`  ${chalk.cyan('Feature')}:    ${intent.feature}`);
  console.log(`  ${chalk.cyan('Scope')}:      ${intent.scope}`);
  console.log(`  ${chalk.cyan('Complexity')}: ${intent.complexity}`);
  console.log(`  ${chalk.cyan('Confidence')}: ${confidenceColor(`${confidencePct}%`)}`);
  console.log();
}

async function confirmPrompt(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() !== 'n' && answer.toLowerCase() !== 'no');
    });
  });
}

function printColoredPreview(prompt: string): void {
  const SECTION_COLORS: Record<string, (s: string) => string> = {
    'Project Instructions': chalk.magenta,
    'Project Context':      chalk.blue,
    'Task':                 chalk.yellow,
    'Requirements':         chalk.green,
    'Recent Changes':       chalk.cyan,
    'Relevant Code':        chalk.dim,
    'Code':                 chalk.dim,
    'Expected Output':      chalk.white,
  };

  const CHARS_PER_TOKEN = 4;
  const sections = prompt.split(/\n---\n/);
  const totalTokens = Math.ceil(prompt.length / CHARS_PER_TOKEN);

  console.log('\n' + chalk.bold('─── Enhanced Prompt Preview ─────────────────────────────────'));
  console.log(chalk.dim(`Total: ~${totalTokens} tokens\n`));

  for (const section of sections) {
    const headerMatch = section.match(/^## (.+)/m);
    const headerName = headerMatch?.[1]?.trim() ?? 'Section';
    const colorFn = SECTION_COLORS[headerName] ?? chalk.white;
    const sectionTokens = Math.ceil(section.length / CHARS_PER_TOKEN);

    console.log(colorFn(chalk.bold(`## ${headerName}`)) + chalk.dim(` (~${sectionTokens} tok)`));
    // Print body (everything after the first line)
    const body = section.replace(/^## .+\n?/, '').trim();
    if (body) {
      const lines = body.split('\n');
      const preview = lines.slice(0, 8).join('\n');
      const rest = lines.length > 8 ? chalk.dim(`\n  ... (${lines.length - 8} more lines)`) : '';
      console.log(colorFn(preview) + rest);
    }
    console.log();
  }

  console.log(chalk.bold('──────────────────────────────────────────────────────────────\n'));
}

// Pricing per million tokens (as of 2026-05)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 0.80,  output: 4.00  },
  'claude-sonnet-4-6':         { input: 3.00,  output: 15.00 },
  'claude-opus-4-7':           { input: 15.00, output: 75.00 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): string {
  const pricing = MODEL_PRICING[model] ?? MODEL_PRICING['claude-sonnet-4-6']!;
  const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
  return cost < 0.001 ? '<0.001' : cost.toFixed(4);
}
