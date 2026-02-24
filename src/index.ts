import { Command } from "commander";
import { authCommand } from "./commands/auth/index.js";
import { postCommand } from "./commands/post/index.js";
import { searchCommand } from "./commands/search/index.js";
import { timelineCommand } from "./commands/timeline/index.js";
import { userCommand } from "./commands/user/index.js";
import { usageCommand } from "./commands/usage/index.js";
import { setGlobalOptions } from "./lib/output.js";

const program = new Command();

program
  .name("xli")
  .description("Modern CLI for X API v2")
  .version("0.1.0")
  .option("--json", "Output as JSON")
  .option("--no-color", "Disable colors")
  .option("--verbose", "Show verbose output including rate limits")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.optsWithGlobals();
    setGlobalOptions({
      json: opts.json,
      noColor: opts.color === false,
      verbose: opts.verbose,
    });
  });

program.addCommand(authCommand);
program.addCommand(postCommand);
program.addCommand(searchCommand);
program.addCommand(timelineCommand);
program.addCommand(userCommand);
program.addCommand(usageCommand);

program.parse();
