import { Command } from "commander";
import ora from "ora";
import { Client } from "@xdevplatform/xdk";
import { startLoginFlow } from "../../lib/auth.js";
import { setAuth, setUser } from "../../lib/config.js";
import { printSuccess, printInfo } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const loginCommand = new Command("login")
  .description("Authenticate with X using OAuth 2.0 PKCE")
  .requiredOption("--client-id <id>", "OAuth 2.0 Client ID", process.env.XLI_CLIENT_ID)
  .action(async (options) => {
    try {
      if (!options.clientId) {
        console.error(
          "Error: Client ID required. Pass --client-id or set XLI_CLIENT_ID env var.",
        );
        process.exit(1);
      }

      printInfo("Opening browser for authentication...");
      const spinner = ora("Waiting for authorization...").start();

      const credentials = await startLoginFlow(options.clientId);
      setAuth(credentials);

      spinner.text = "Verifying credentials...";

      const client = new Client({ accessToken: credentials.accessToken });
      const me = await client.users.getMe({
        userFields: ["id", "name", "username"],
      });

      if (me.data) {
        setUser({
          id: me.data.id!,
          username: me.data.username!,
          name: me.data.name!,
        });
        spinner.stop();
        printSuccess(`Logged in as @${me.data.username} (${me.data.name})`);
      } else {
        spinner.stop();
        printSuccess("Authentication successful.");
      }
    } catch (error) {
      handleError(error);
    }
  });
