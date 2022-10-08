import fs from "fs";
import path from "path";
import Discord from "discord.js";
import getPath from "./util/getPath.js";

const { __dirname } = getPath(import.meta.url);

const userDataPath = path.join(__dirname, "..", "users.json");
const userDatas = JSON.parse(fs.readFileSync(userDataPath, "utf8"));
setInterval(() => {
  fs.writeFileSync(userDataPath, JSON.stringify(userDatas));
}, 2500);

export interface ItmeBehavior<T> {
  "default": T,
  [key: string]: T
}
export interface BehaviorData {
  message: ItmeBehavior<string>;
  itemGive: ItmeBehavior<string> | null;
  itemRemove: ItmeBehavior<string> | null;
  roleGive: ItmeBehavior<string[]>;
  roleRemove: ItmeBehavior<string[]>;
}

export default class CommandBehavior {
  behaviors: Map<string, BehaviorData> = new Map();

  constructor() {
  }

  addBehavior(inputStr: string, data: BehaviorData) {
    this.behaviors.set(inputStr, {
      message: typeof data.message === "string" ? { "default": data.message } : data.message,
      itemGive: typeof data.itemGive === "string" ? { "default": data.itemGive } : data.itemGive,
      itemRemove: typeof data.itemRemove === "string" ? { "default": data.itemRemove } : data.itemRemove,
      roleGive: Array.isArray(data.roleGive) ? { "default": data.roleGive } : data.roleGive,
      roleRemove: Array.isArray(data.roleRemove) ? { "default": data.roleRemove } : data.roleRemove
    });
  }

  async input(str: string | null, guild: Discord.Guild, guildMemeber: Discord.GuildMember) {
    const itemHave: string[] = userDatas[guildMemeber.id] ?? [];
    const behave = this.behaviors.get(str ?? "default") ?? this.behaviors.get("fail");
    console.log(behave);
    if (!behave) return;
    let message = behave.message.default ?? "...";
    for (const key in behave.message) {
      const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
      if (condTest) {
        message = behave.message[key];
        break;
      }
    }

    if (behave.roleGive) {
      let roleGive = behave.roleGive.default ?? [];
      for (const key in behave.roleGive) {
        const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
        if (condTest) {
          roleGive = behave.roleGive[key];
          break;
        }
      }
      for (let i = 0; i < roleGive.length; i++) {
        const roleToGive = await guild.roles.fetch(roleGive[i], {});
        if (!roleToGive) continue;
        await guildMemeber.roles.add(roleToGive);
      }
    }
    if (behave.roleRemove) {
      let roleRemove = behave.roleRemove.default ?? [];
      for (const key in behave.roleRemove) {
        const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
        if (condTest) {
          roleRemove = behave.roleRemove[key];
          break;
        }
      }
      for (let i = 0; i < roleRemove.length; i++) {
        const roleToRemove = await guild.roles.fetch(roleRemove[i], {});
        if (!roleToRemove) continue;
        await guildMemeber.roles.remove(roleToRemove);
      }
    }
    if (behave.itemGive) {
      let itemGive = behave.itemGive.default ?? "";
      for (const key in behave.itemGive) {
        const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
        if (condTest) {
          itemGive = behave.itemGive[key];
          break;
        }
      }
      if (itemGive && !itemHave.includes(itemGive)) {
        itemHave.push(itemGive);
      }
    }
    if (behave.itemRemove) {
      let itemRemove = behave.itemRemove.default ?? "";
      for (const key in behave.itemRemove) {
        const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
        if (condTest) {
          itemRemove = behave.itemRemove[key];
          break;
        }
      }
      if (itemRemove) {
        while (itemHave.includes(itemRemove)) {
          const itemIdx = itemHave.findIndex(i => i === itemRemove);
          if (itemIdx === -1) {
            itemHave.splice(itemIdx, 1);
          }
          break;
        }
      }
    }

    userDatas[guildMemeber.id] = itemHave;
    return message;
  }
}
