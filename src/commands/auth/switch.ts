import { Command } from "commander";
import { switchAccount, listAccounts } from "../../lib/config.js";
import { printSuccess } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const switchCommand = new Command("switch")
  .description("Switch active account")
  .argument("<account>", "Account to switch to (e.g. @username or username)")
  .action((account: string) => {
    try {
      if (switchAccount(account)) {
        const key = account.startsWith("@") ? account : `@${account}`;
        printSuccess(`Switched to ${key}`);
      } else {
        const accounts = listAccounts();
        const key = account.startsWith("@") ? account : `@${account}`;
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
