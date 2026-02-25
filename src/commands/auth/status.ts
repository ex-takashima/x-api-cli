import { Command } from "commander";
import chalk from "chalk";
import {
  getAuth,
  getUser,
  getConfigPath,
  isAuthenticated,
  listAccounts,
  getCurrentAccountKey,
} from "../../lib/config.js";
import { shouldOutputJson, outputJson } from "../../lib/output.js";

export const statusCommand = new Command("status")
  .description("Show current authentication status")
  .action(() => {
    const accounts = listAccounts();
    const currentKey = getCurrentAccountKey();

    if (!isAuthenticated()) {
      if (shouldOutputJson()) {
        outputJson({ authenticated: false, accounts: [] });
      } else {
        console.log(`${chalk.red("✗")} Not authenticated`);
        console.log(`  Run ${chalk.cyan("xli auth login --client-id <id>")} to authenticate.`);
      }
      return;
    }

    const auth = getAuth()!;
    const user = getUser();
    const expiresIn = Math.max(0, Math.floor((auth.expiresAt - Date.now()) / 1000));
    const isExpired = expiresIn === 0;

    if (shouldOutputJson()) {
      outputJson({
        authenticated: true,
        currentAccount: currentKey,
        user: user ?? null,
        expiresIn,
        expired: isExpired,
        scopes: auth.scope,
        accounts: accounts.map((a) => ({
          key: a.key,
          current: a.current,
          user: a.data.user,
        })),
        configPath: getConfigPath(),
      });
      return;
    }

    console.log(`${chalk.green("✓")} Authenticated`);
    if (user) {
      console.log(`  Account: @${user.username} (${user.name})`);
    }
    if (isExpired) {
      console.log(`  Token:   ${chalk.red("expired")} (will refresh automatically)`);
    } else {
      const mins = Math.floor(expiresIn / 60);
      console.log(`  Token:   expires in ${mins}m`);
    }
    console.log(`  Scopes:  ${auth.scope.join(", ")}`);

    if (accounts.length > 1) {
      console.log();
      console.log(chalk.bold(`  All accounts (${accounts.length}):`));
      for (const { key, current } of accounts) {
        const marker = current ? chalk.green("*") : " ";
        console.log(`  ${marker} ${key}`);
      }
    }

    console.log(`  Config:  ${getConfigPath()}`);
  });
