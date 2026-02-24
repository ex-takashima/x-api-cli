import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getClient } from "../../lib/client.js";
import { getUser } from "../../lib/config.js";
import { DEFAULT_TWEET_FIELDS, DEFAULT_USER_FIELDS, DEFAULT_TWEET_EXPANSIONS } from "../../lib/fields.js";
import {
  shouldOutputJson,
  outputJson,
  formatRelativeTime,
  truncate,
} from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const homeTimelineCommand = new Command("home")
  .description("View your home timeline")
  .option("--max <n>", "Maximum results", "20")
  .action(async (options: { max: string }) => {
    const max = Number(options.max);
    const spinner = ora("Fetching timeline...").start();
    try {
      const client = await getClient();
      const user = getUser();
      if (!user) {
        spinner.stop();
        console.error("User info not available. Run `xli auth login` again.");
        process.exit(1);
      }

      const response = await client.users.getTimeline(user.id, {
        maxResults: Math.min(max, 100),
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
        console.log("No posts in timeline.");
        return;
      }

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
