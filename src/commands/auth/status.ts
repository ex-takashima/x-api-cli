import { Command } from "commander";
import chalk from "chalk";
import { getAuth, getUser, getConfigPath, isAuthenticated } from "../../lib/config.js";
import { shouldOutputJson, outputJson } from "../../lib/output.js";

export const statusCommand = new Command("status")
  .description("Show current authentication status")
  .action(() => {
    if (!isAuthenticated()) {
      if (shouldOutputJson()) {
        outputJson({ authenticated: false });
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
        user: user ?? null,
        expiresIn,
        expired: isExpired,
        scopes: auth.scope,
        configPath: getConfigPath(),
      });
      return;
    }

    console.log(`${chalk.green("✓")} Authenticated`);
    if (user) {
      console.log(`  User:    @${user.username} (${user.name})`);
    }
    if (isExpired) {
      console.log(`  Token:   ${chalk.red("expired")} (will refresh automatically)`);
    } else {
      const mins = Math.floor(expiresIn / 60);
      console.log(`  Token:   expires in ${mins}m`);
    }
    console.log(`  Scopes:  ${auth.scope.join(", ")}`);
    console.log(`  Config:  ${getConfigPath()}`);
  });
