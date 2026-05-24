import { Command } from 'commander';
import ora from 'ora';
import { error } from './logger.js';
import { EnhanceError } from './errors.js';
import { loadConfig } from '../config/index.js';
import { scanProject } from '../scanner/index.js';
import { getCached, setCached } from '../cache/index.js';
import { analyzeIntent } from '../analyzer/intent.js';
import { findRelevantFiles } from '../analyzer/context.js';
import { enhance } from '../enhancer/index.js';
import { getProvider } from '../providers/index.js';

const program = new Command();

program
  .name('enhance')
  .description('AI prompt middleware — upgrades vague prompts into production-quality AI instructions')
  .version('0.1.0');

program
  .argument('<prompt>', 'The raw prompt to enhance')
  .option('-p, --provider <name>', 'AI provider: claude | codex | opencode', 'claude')
  .option('--dry-run', 'Print enhanced prompt without sending to AI')
  .option('--print-prompt', 'Print enhanced prompt before sending')
  .option('--verbose', 'Show scan result and intent')
  .action(async (rawPrompt: string, opts: {
    provider: string;
    dryRun: boolean;
    printPrompt: boolean;
    verbose: boolean;
  }) => {
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
      const intent = analyzeIntent(rawPrompt);

      if (opts.verbose) {
        spinner.stop();
        console.log('\nStack detected:', JSON.stringify(scan.stack, null, 2));
        console.log('\nIntent:', JSON.stringify(intent, null, 2));
        spinner.start('Optimizing context...');
      }

      spinner.text = 'Optimizing context...';
      const contextFiles = await findRelevantFiles(cwd, intent, scan.structure);

      spinner.text = 'Enhancing prompt...';
      const enhanced = enhance(rawPrompt, scan, contextFiles);

      spinner.stop();

      if (opts.dryRun || opts.printPrompt) {
        console.log('\n─── Enhanced Prompt ─────────────────────────────────\n');
        console.log(enhanced.enhanced);
        console.log('\n─────────────────────────────────────────────────────\n');
      }

      if (opts.dryRun) {
        process.exit(0);
      }

      spinner.start('Sending to AI...');
      const provider = getProvider(config);
      spinner.stop();

      console.log(`\n[${provider.name}]\n`);
      await provider.send(enhanced.enhanced);

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
