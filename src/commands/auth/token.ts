import { Command } from "commander";
import { ensureValidToken } from "../../lib/auth.js";
import { isAuthenticated } from "../../lib/config.js";
import { handleError } from "../../lib/errors.js";
import { AuthRequiredError } from "../../lib/errors.js";

export const tokenCommand = new Command("token")
  .description("Print current access token (for scripting)")
  .action(async () => {
    try {
      if (!isAuthenticated()) throw new AuthRequiredError();
      const token = await ensureValidToken();
      process.stdout.write(token);
    } catch (error) {
      handleError(error);
    }
  });
