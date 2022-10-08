import Discord from "discord.js";
import CommandBehavior from "./CommandBehavior.js";

interface CommandHandlerOptions {
  interaction: Discord.CommandInteraction;
  guild: Discord.Guild,
  member: Discord.GuildMember
}

type CommandHandler = (options: CommandHandlerOptions) => Promise<void>;

export interface CommandData {
  commandName: string;
  commandBehavior: CommandBehavior;
  slashCommand: Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  handler: CommandHandler;
  permRoleId: string | null;
  ephemeral: boolean;
}

export default function createCommand(name: string, paramRoleId?: string): CommandData {
  const commandBehavior = new CommandBehavior();

  return {
    commandName: name,
    commandBehavior,
    handler: async ({ interaction, guild, member }) => {
      console.log(interaction.commandName);
      // @ts-ignore
      const value = interaction.options.getString("값") as string;
      const message = await commandBehavior.input(value ?? null, guild, member) ?? "...";
      console.log(message);
      try {
        interaction.reply(message);
      } catch (e) {
        console.error(e);
      }
    },
    slashCommand: new Discord.SlashCommandBuilder()
      .setName(name),
    permRoleId: paramRoleId ?? null,
    ephemeral: false
  }
}
