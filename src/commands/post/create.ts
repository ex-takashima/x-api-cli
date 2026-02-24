import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { getClient } from "../../lib/client.js";
import { shouldOutputJson, outputJson, printSuccess } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const createPostCommand = new Command("create")
  .description("Create a new post")
  .argument("<text>", "Post text content")
  .option("--reply-to <id>", "Reply to a post ID")
  .option("--quote <id>", "Quote a post ID")
  .action(async (text: string, options: { replyTo?: string; quote?: string }) => {
    const spinner = ora("Posting...").start();
    try {
      const client = await getClient();

      const body: Record<string, any> = { text };

      if (options.replyTo) {
        body.reply = { in_reply_to_tweet_id: options.replyTo };
      }
      if (options.quote) {
        body.quote_tweet_id = options.quote;
      }

      const response = await client.posts.create(body as any);
      spinner.stop();

      if (shouldOutputJson()) {
        outputJson(response);
        return;
      }

      const id = response.data?.id;
      printSuccess(`Post created!`);
      if (id) {
        console.log(chalk.dim(`  ID: ${id}`));
        console.log(chalk.dim(`  https://x.com/i/status/${id}`));
      }
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
