import { Command } from "commander";
import { clearAuth, isAuthenticated } from "../../lib/config.js";
import { printSuccess, printWarning } from "../../lib/output.js";

export const logoutCommand = new Command("logout")
  .description("Remove stored credentials")
  .action(() => {
    if (!isAuthenticated()) {
      printWarning("Not currently authenticated.");
      return;
    }
    clearAuth();
    printSuccess("Logged out successfully.");
  });
