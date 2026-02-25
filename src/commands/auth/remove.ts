import { Command } from "commander";
import { removeAccount, listAccounts, getCurrentAccountKey } from "../../lib/config.js";
import { printSuccess, printInfo } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const removeCommand = new Command("remove")
  .alias("rm")
  .description("Remove a stored account")
  .argument("<account>", "Account to remove (e.g. @username or username)")
  .option("-y, --yes", "Skip confirmation")
  .action(async (account: string, options) => {
    try {
      const key = account.startsWith("@") ? account : `@${account}`;

      if (!options.yes) {
        const readline = await import("node:readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        const answer = await new Promise<string>((resolve) => {
          rl.question(`Remove account ${key}? (y/N) `, resolve);
        });
        rl.close();
        if (answer.toLowerCase() !== "y") {
          printInfo("Cancelled.");
          return;
        }
      }

      if (removeAccount(key)) {
        printSuccess(`Removed ${key}`);
        const current = getCurrentAccountKey();
        if (current) {
          printInfo(`Active account: ${current}`);
        }
      } else {
        const accounts = listAccounts();
        console.error(`Error: Account ${key} not found.`);
        if (accounts.length > 0) {
          console.error(`Available accounts: ${accounts.map((a) => a.key).join(", ")}`);
        }
        process.exit(1);
      }
    } catch (error) {
      handleError(error);
    }
  });
