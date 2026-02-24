import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getClient } from "../../lib/client.js";
import { DEFAULT_TWEET_FIELDS, DEFAULT_USER_FIELDS, DEFAULT_TWEET_EXPANSIONS } from "../../lib/fields.js";
import {
  shouldOutputJson,
  outputJson,
  formatRelativeTime,
  truncate,
  outputTable,
} from "../../lib/output.js";
import { collectPages } from "../../lib/pagination.js";
import { handleError } from "../../lib/errors.js";

export const searchRecentCommand = new Command("recent")
  .description("Search recent posts (last 7 days)")
  .argument("<query>", "Search query")
  .option("--max <n>", "Maximum results", "10")
  .action(async (query: string, options: { max: string }) => {
    const max = Number(options.max);
    const spinner = ora("Searching...").start();
    try {
      const client = await getClient();
      const response = await client.posts.searchRecent(query, {
        maxResults: Math.max(10, Math.min(max, 100)),
        tweetFields: [...DEFAULT_TWEET_FIELDS],
        expansions: [...DEFAULT_TWEET_EXPANSIONS],
        userFields: [...DEFAULT_USER_FIELDS],
      });

      spinner.stop();

      const posts = response.data ?? [];
      const users = response.includes?.users ?? [];

      if (shouldOutputJson()) {
        outputJson(response);
        return;
      }

      if (posts.length === 0) {
        console.log("No results found.");
        return;
      }

      console.log(chalk.dim(`Found ${posts.length} result(s) for "${query}":\n`));

      for (const post of posts.slice(0, max)) {
        const author = users.find((u: any) => u.id === post.authorId);
        const name = author ? `@${author.username}` : post.authorId;
        const time = post.createdAt ? formatRelativeTime(post.createdAt) : "";

        console.log(`${chalk.bold(name)} ${chalk.dim(time)}`);
        console.log(truncate(post.text!, 280));

        const m = post.publicMetrics;
        if (m) {
          console.log(
            chalk.dim(
              `  ♥ ${m.likeCount}  ↻ ${m.retweetCount}  💬 ${m.replyCount}`,
            ),
          );
        }
        console.log();
      }
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
