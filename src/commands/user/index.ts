import { Command } from "commander";
import { viewUserCommand } from "./view.js";
import { meCommand } from "./me.js";

export const userCommand = new Command("user")
  .description("View user profiles")
  .addCommand(viewUserCommand)
  .addCommand(meCommand);
