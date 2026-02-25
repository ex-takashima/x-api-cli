import { Command } from "commander";
import chalk from "chalk";
import { listAccounts, getConfigPath } from "../../lib/config.js";
import { shouldOutputJson, outputJson } from "../../lib/output.js";

export const listCommand = new Command("list")
  .alias("ls")
  .description("List all authenticated accounts")
  .action(() => {
    const accounts = listAccounts();

    if (accounts.length === 0) {
      if (shouldOutputJson()) {
        outputJson({ accounts: [] });
      } else {
        console.log("No accounts configured.");
        console.log(`  Run ${chalk.cyan("xli auth login --client-id <id>")} to add one.`);
      }
      return;
    }

    if (shouldOutputJson()) {
      outputJson({
        accounts: accounts.map((a) => ({
          key: a.key,
          current: a.current,
          user: a.data.user,
        })),
      });
      return;
    }

    console.log(chalk.bold("Accounts:"));
    for (const { key, data, current } of accounts) {
      const marker = current ? chalk.green("* ") : "  ";
      const name = data.user.name ? ` (${data.user.name})` : "";
      console.log(`${marker}${key}${name}`);
    }
    console.log();
    console.log(`Config: ${getConfigPath()}`);
  });
