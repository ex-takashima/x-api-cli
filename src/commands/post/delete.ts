import { Command } from "commander";
import readline from "node:readline";
import ora from "ora";
import { getClient } from "../../lib/client.js";
import { shouldOutputJson, outputJson, printSuccess } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(`${message} (y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

export const deletePostCommand = new Command("delete")
  .description("Delete a post by ID")
  .argument("<id>", "Post ID to delete")
  .option("-y, --yes", "Skip confirmation")
  .action(async (id: string, options: { yes?: boolean }) => {
    try {
      if (!options.yes) {
        const ok = await confirm(`Delete post ${id}?`);
        if (!ok) {
          console.log("Cancelled.");
          return;
        }
      }

      const spinner = ora("Deleting post...").start();
      const client = await getClient();
      const response = await client.posts.delete(id);
      spinner.stop();

      if (shouldOutputJson()) {
        outputJson(response);
        return;
      }

      printSuccess(`Post ${id} deleted.`);
    } catch (error) {
      handleError(error);
    }
  });
