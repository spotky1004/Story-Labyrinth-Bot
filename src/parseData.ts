import fs from "fs";
import path from "path";
import getPath from "./util/getPath.js";
import createCommand, { CommandData } from "./createCommand.js";

const { __dirname } = getPath(import.meta.url);
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json"), "utf8"));

const rooms = Object.entries(data.rooms);
const commands: Map<string, CommandData> = new Map();

for (const [reqRoleId, data] of rooms) {
  const dataArr = Object.entries(data as any) as [string, any][];
  for (const [commandName, commandData] of dataArr) {
    const command = createCommand(commandName, reqRoleId === "any" ? undefined : reqRoleId);
    commands.set(commandName, command);
    command.slashCommand.setDescription(commandData.descripton ?? "...");
    if (commandData.message) {
      command.commandBehavior.addBehavior("default", {
        message: commandData.message,
        itemGive: commandData.itemGive ?? "",
        itemRemove: commandData.itemRemove ?? "",
        roleGive: commandData.roleGive ?? [],
        roleRemove: commandData.roleRemove ?? [],
      });
    }

    if ("param" in commandData) {
      // const required = "default" in commandData.param;
      // const choises = Object.entries(commandData.param).filter(([key]) => key !== "default");
      command.slashCommand
        .addStringOption(input => 
          input
            .setName("값")
            .setDescription("값을 입력해주세요")
            // .addChoices(...choises.map(([value]) => ({
            //   name: value,
            //   value: value
            // })))
            // .setAutocomplete(false)
            // .setRequired(required)
        );
      const paramArr = Object.entries(commandData.param) as [string, any][];
      for (const [paramName, paramData] of paramArr) {
        command.commandBehavior.addBehavior(paramName, {
          message: paramData.message,
          itemGive: paramData.itemGive ?? "",
          itemRemove: paramData.itemRemove ?? "",
          roleGive: paramData.roleGive ?? "",
          roleRemove: paramData.roleRemove ?? [],
        });
      }
    }
  }
}

export default commands;
