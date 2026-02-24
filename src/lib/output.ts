import chalk from "chalk";
import Table from "cli-table3";
import type { GlobalOptions } from "../types/config.js";

let globalOpts: GlobalOptions = {};

export function setGlobalOptions(opts: GlobalOptions): void {
  globalOpts = opts;
  if (opts.noColor) {
    chalk.level = 0;
  }
}

export function getGlobalOptions(): GlobalOptions {
  return globalOpts;
}

export function shouldOutputJson(): boolean {
  return globalOpts.json === true || !process.stdout.isTTY;
}

export function outputJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function outputTable(
  headers: string[],
  rows: string[][],
  options?: { colWidths?: number[] },
): void {
  const table = new Table({
    head: headers.map((h) => chalk.bold(h)),
    colWidths: options?.colWidths,
    wordWrap: true,
    style: { head: [] },
  });
  for (const row of rows) {
    table.push(row);
  }
  console.log(table.toString());
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

export function printSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

export function printWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

export function printInfo(message: string): void {
  console.log(chalk.cyan(`ℹ ${message}`));
}

export function printVerbose(message: string): void {
  if (globalOpts.verbose) {
    console.error(chalk.dim(`  ${message}`));
  }
}
