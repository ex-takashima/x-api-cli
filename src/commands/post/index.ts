import { Command } from "commander";
import { viewPostCommand } from "./view.js";
import { createPostCommand } from "./create.js";
import { deletePostCommand } from "./delete.js";

export const postCommand = new Command("post")
  .description("Manage posts")
  .addCommand(viewPostCommand)
  .addCommand(createPostCommand)
  .addCommand(deletePostCommand);
