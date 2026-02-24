import { Command } from "commander";
import { searchRecentCommand } from "./recent.js";
import { searchAllCommand } from "./all.js";

export const searchCommand = new Command("search")
  .description("Search posts")
  .addCommand(searchRecentCommand)
  .addCommand(searchAllCommand);
