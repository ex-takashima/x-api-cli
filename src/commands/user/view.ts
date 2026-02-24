import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getClient } from "../../lib/client.js";
import { DEFAULT_USER_FIELDS } from "../../lib/fields.js";
import {
  shouldOutputJson,
  outputJson,
  formatNumber,
  formatDate,
} from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const viewUserCommand = new Command("view")
  .description("View a user profile")
  .argument("<target>", "Username (without @) or user ID")
  .action(async (target: string) => {
    const spinner = ora("Fetching user...").start();
    try {
      const client = await getClient();

      const isId = /^\d+$/.test(target);
      const response = isId
        ? await client.users.getById(target, {
            userFields: [...DEFAULT_USER_FIELDS],
          })
        : await client.users.getByUsername(target.replace(/^@/, ""), {
            userFields: [...DEFAULT_USER_FIELDS],
          });

      spinner.stop();

      if (!response.data) {
        console.error("User not found.");
        process.exit(1);
      }

      const user = response.data;

      if (shouldOutputJson()) {
        outputJson(response);
        return;
      }

      console.log(
        `${chalk.bold(user.name)} ${chalk.dim(`@${user.username}`)}`,
      );
      if (user.description) {
        console.log(user.description);
      }
      console.log();

      const m = user.publicMetrics;
      if (m) {
        console.log(
          [
            `${chalk.bold(formatNumber(m.followersCount!))} followers`,
            `${chalk.bold(formatNumber(m.followingCount!))} following`,
            `${chalk.bold(formatNumber(m.tweetCount!))} posts`,
          ].join("  "),
        );
      }

      const details: string[] = [];
      if (user.location) details.push(`📍 ${user.location}`);
      if (user.createdAt) details.push(`📅 Joined ${formatDate(user.createdAt)}`);
      if (user.url) details.push(`🔗 ${user.url}`);
      if (details.length) {
        console.log(chalk.dim(details.join("  ")));
      }

      console.log(chalk.dim(`\nID: ${user.id}`));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
