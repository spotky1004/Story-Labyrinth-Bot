var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import fs from "fs";
import path from "path";
import getPath from "./util/getPath.js";
import createCommand from "./createCommand.js";
const { __dirname } = getPath(import.meta.url);
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json"), "utf8"));
const rooms = Object.entries(data.rooms);
const commands = new Map();
for (const [reqRoleId, data] of rooms) {
    const dataArr = Object.entries(data);
    for (const [commandName, commandData] of dataArr) {
        const command = createCommand(commandName, reqRoleId === "any" ? undefined : reqRoleId);
        commands.set(commandName, command);
        command.slashCommand.setDescription((_a = commandData.descripton) !== null && _a !== void 0 ? _a : "...");
        if (commandData.message) {
            command.commandBehavior.addBehavior("default", {
                message: commandData.message,
                itemGive: (_b = commandData.itemGive) !== null && _b !== void 0 ? _b : "",
                itemRemove: (_c = commandData.itemRemove) !== null && _c !== void 0 ? _c : "",
                roleGive: (_d = commandData.roleGive) !== null && _d !== void 0 ? _d : [],
                roleRemove: (_e = commandData.roleRemove) !== null && _e !== void 0 ? _e : [],
            });
        }
        if ("param" in commandData) {
            // const required = "default" in commandData.param;
            // const choises = Object.entries(commandData.param).filter(([key]) => key !== "default");
            command.slashCommand
                .addStringOption(input => input
                .setName("값")
                .setDescription("값을 입력해주세요")
            // .addChoices(...choises.map(([value]) => ({
            //   name: value,
            //   value: value
            // })))
            // .setAutocomplete(false)
            // .setRequired(required)
            );
            const paramArr = Object.entries(commandData.param);
            for (const [paramName, paramData] of paramArr) {
                command.commandBehavior.addBehavior(paramName, {
                    message: paramData.message,
                    itemGive: (_f = paramData.itemGive) !== null && _f !== void 0 ? _f : "",
                    itemRemove: (_g = paramData.itemRemove) !== null && _g !== void 0 ? _g : "",
                    roleGive: (_h = paramData.roleGive) !== null && _h !== void 0 ? _h : "",
                    roleRemove: (_j = paramData.roleRemove) !== null && _j !== void 0 ? _j : [],
                });
            }
        }
    }
}
export default commands;
