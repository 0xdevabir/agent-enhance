import chalk from 'chalk';

export const log = (msg: string) => console.log(chalk.gray(msg));
export const info = (msg: string) => console.log(chalk.blue(msg));
export const warn = (msg: string) => console.warn(chalk.yellow(`⚠ ${msg}`));
export const success = (msg: string) => console.log(chalk.green(`✓ ${msg}`));
export const error = (msg: string, err?: unknown) => {
  console.error(chalk.red(`✗ ${msg}`));
  if (err instanceof Error && process.env['ENHANCE_DEBUG']) {
    console.error(chalk.red(err.stack));
  }
};
