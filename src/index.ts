import { Command } from "commander";
import { authCommand } from "./commands/auth/index.js";
import { postCommand } from "./commands/post/index.js";
import { searchCommand } from "./commands/search/index.js";
import { timelineCommand } from "./commands/timeline/index.js";
import { userCommand } from "./commands/user/index.js";
import { usageCommand } from "./commands/usage/index.js";
import { setGlobalOptions } from "./lib/output.js";
import { setAccountOverride } from "./lib/config.js";

const program = new Command();

program
  .name("xli")
  .description("Modern CLI for X API v2")
  .version("0.2.0")
  .option("--json", "Output as JSON")
  .option("--no-color", "Disable colors")
  .option("--verbose", "Show verbose output including rate limits")
  .option("--account <name>", "Use specific account (e.g. @username)")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.optsWithGlobals();
    setGlobalOptions({
      json: opts.json,
      noColor: opts.color === false,
      verbose: opts.verbose,
      account: opts.account,
    });
    if (opts.account) {
      setAccountOverride(opts.account);
    }
  });

program.addCommand(authCommand);
program.addCommand(postCommand);
program.addCommand(searchCommand);
program.addCommand(timelineCommand);
program.addCommand(userCommand);
program.addCommand(usageCommand);

program.parse();
