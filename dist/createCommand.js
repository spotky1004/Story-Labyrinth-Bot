import Discord from "discord.js";
import CommandBehavior from "./CommandBehavior.js";
export default function createCommand(name, paramRoleId) {
    const commandBehavior = new CommandBehavior();
    return {
        commandName: name,
        commandBehavior,
        handler: async ({ interaction, guild, member }) => {
            var _a;
            console.log(interaction.commandName);
            // @ts-ignore
            const value = interaction.options.getString("값");
            const message = (_a = await commandBehavior.input(value !== null && value !== void 0 ? value : null, guild, member)) !== null && _a !== void 0 ? _a : "...";
            console.log(message);
            try {
                interaction.reply(message);
            }
            catch (e) {
                console.error(e);
            }
        },
        slashCommand: new Discord.SlashCommandBuilder()
            .setName(name),
        permRoleId: paramRoleId !== null && paramRoleId !== void 0 ? paramRoleId : null,
        ephemeral: false
    };
}
