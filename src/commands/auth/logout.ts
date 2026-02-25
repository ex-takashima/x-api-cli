import { Command } from "commander";
import { clearAuth, isAuthenticated, getUser } from "../../lib/config.js";
import { printSuccess, printWarning } from "../../lib/output.js";

export const logoutCommand = new Command("logout")
  .description("Remove stored credentials for current account")
  .action(() => {
    if (!isAuthenticated()) {
      printWarning("Not currently authenticated.");
      return;
    }
    const user = getUser();
    clearAuth();
    if (user) {
      printSuccess(`Logged out @${user.username}`);
    } else {
      printSuccess("Logged out successfully.");
    }
  });
