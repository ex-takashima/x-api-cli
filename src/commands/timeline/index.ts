import { Command } from "commander";
import { homeTimelineCommand } from "./home.js";
import { userTimelineCommand } from "./user.js";
import { mentionsTimelineCommand } from "./mentions.js";

export const timelineCommand = new Command("timeline")
  .description("View timelines")
  .addCommand(homeTimelineCommand)
  .addCommand(userTimelineCommand)
  .addCommand(mentionsTimelineCommand);
