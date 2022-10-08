import Discord from "discord.js";
import dotenv from "dotenv";
import commands from "./parseData.js";
import deployCommand from "./deployCommand.js";
void dotenv.config({
    path: ".env"
});
const token = process.env.TOKEN;
const rest = new Discord.REST({ version: '10' }).setToken(token);
const client = new Discord.Client({
    intents: []
});
client.on("ready", async () => {
    var _a, _b;
    console.log((_a = client.user) === null || _a === void 0 ? void 0 : _a.username);
    await deployCommand([...commands.values()].map(c => [c.permRoleId, c.slashCommand.toJSON()]), process.env.GUILD_ID, ((_b = client.user) !== null && _b !== void 0 ? _b : {}).id, rest);
});
client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
        const command = commands.get(interaction.commandName);
        if (command &&
            interaction.inGuild() &&
            interaction.guild &&
            interaction.member) {
            command.handler({
                interaction: interaction,
                guild: interaction.guild,
                // @ts-ignore
                member: interaction.member
            });
        }
    }
});
client.login(token);
