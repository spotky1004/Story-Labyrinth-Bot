import fs from "fs";
import path from "path";
import getPath from "./util/getPath.js";
const { __dirname } = getPath(import.meta.url);
const userDataPath = path.join(__dirname, "..", "users.json");
const userDatas = JSON.parse(fs.readFileSync(userDataPath, "utf8"));
setInterval(() => {
    fs.writeFileSync(userDataPath, JSON.stringify(userDatas));
}, 2500);
export default class CommandBehavior {
    constructor() {
        this.behaviors = new Map();
    }
    addBehavior(inputStr, data) {
        this.behaviors.set(inputStr, {
            message: typeof data.message === "string" ? { "default": data.message } : data.message,
            itemGive: typeof data.itemGive === "string" ? { "default": data.itemGive } : data.itemGive,
            itemRemove: typeof data.itemRemove === "string" ? { "default": data.itemRemove } : data.itemRemove,
            roleGive: Array.isArray(data.roleGive) ? { "default": data.roleGive } : data.roleGive,
            roleRemove: Array.isArray(data.roleRemove) ? { "default": data.roleRemove } : data.roleRemove
        });
    }
    async input(str, guild, guildMemeber) {
        var _a, _b, _c, _d, _e, _f, _g;
        const itemHave = (_a = userDatas[guildMemeber.id]) !== null && _a !== void 0 ? _a : [];
        const behave = (_b = this.behaviors.get(str !== null && str !== void 0 ? str : "default")) !== null && _b !== void 0 ? _b : this.behaviors.get("fail");
        console.log(behave);
        if (!behave)
            return;
        let message = (_c = behave.message.default) !== null && _c !== void 0 ? _c : "...";
        for (const key in behave.message) {
            const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
            if (condTest) {
                message = behave.message[key];
                break;
            }
        }
        if (behave.roleGive) {
            let roleGive = (_d = behave.roleGive.default) !== null && _d !== void 0 ? _d : [];
            for (const key in behave.roleGive) {
                const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
                if (condTest) {
                    roleGive = behave.roleGive[key];
                    break;
                }
            }
            for (let i = 0; i < roleGive.length; i++) {
                const roleToGive = await guild.roles.fetch(roleGive[i], {});
                if (!roleToGive)
                    continue;
                await guildMemeber.roles.add(roleToGive);
            }
        }
        if (behave.roleRemove) {
            let roleRemove = (_e = behave.roleRemove.default) !== null && _e !== void 0 ? _e : [];
            for (const key in behave.roleRemove) {
                const condTest = itemHave.includes(key) || key.split(",").every(item => itemHave.includes(item));
                if (condTest) {
                    roleRemove = behave.roleRemove[key];
                    break;
                }
            }
            for (let i = 0; i < roleRemove.length; i++) {
                const roleToRemove = await guild.roles.fetch(roleRemove[i], {});
                if (!roleToRemove)
                    continue;
                await guildMemeber.roles.remove(roleToRemove);
            }
        }
        if (behave.itemGive) {
            let itemGive = (_f = behave.itemGive.default) !== null && _f !== void 0 ? _f : "";
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
            let itemRemove = (_g = behave.itemRemove.default) !== null && _g !== void 0 ? _g : "";
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
