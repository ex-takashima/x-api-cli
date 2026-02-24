import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getClient } from "../../lib/client.js";
import { DEFAULT_TWEET_FIELDS, DEFAULT_USER_FIELDS, DEFAULT_TWEET_EXPANSIONS } from "../../lib/fields.js";
import { shouldOutputJson, outputJson, formatNumber, formatRelativeTime } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const viewPostCommand = new Command("view")
  .description("View a post by ID")
  .argument("<id>", "Post ID")
  .action(async (id: string) => {
    const spinner = ora("Fetching post...").start();
    try {
      const client = await getClient();
      const response = await client.posts.getById(id, {
        tweetFields: [...DEFAULT_TWEET_FIELDS],
        expansions: [...DEFAULT_TWEET_EXPANSIONS],
        userFields: [...DEFAULT_USER_FIELDS],
      });

      spinner.stop();

      if (!response.data) {
        console.error("Post not found.");
        process.exit(1);
      }

      const post = response.data;
      const author = response.includes?.users?.find(
        (u: any) => u.id === post.authorId,
      );

      if (shouldOutputJson()) {
        outputJson({ data: post, includes: response.includes });
        return;
      }

      const authorName = author ? `${author.name} (@${author.username})` : post.authorId;
      console.log(chalk.bold(authorName));
      if (post.createdAt) {
        console.log(chalk.dim(formatRelativeTime(post.createdAt)));
      }
      console.log();
      console.log(post.text);
      console.log();

      const m = post.publicMetrics;
      if (m) {
        const metrics = [
          `${chalk.bold(formatNumber(m.likeCount!))} likes`,
          `${chalk.bold(formatNumber(m.retweetCount!))} reposts`,
          `${chalk.bold(formatNumber(m.replyCount!))} replies`,
          `${chalk.bold(formatNumber(m.quoteCount!))} quotes`,
        ];
        console.log(chalk.dim(metrics.join("  ")));
      }

      console.log(chalk.dim(`\nID: ${post.id}`));
      console.log(chalk.dim(`https://x.com/i/status/${post.id}`));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
