import Discord from "discord.js";
import dotenv from "dotenv";
import commands from "./parseData.js";
import deployCommand from "./deployCommand.js";

void dotenv.config({
  path: ".env"
});

const token = process.env.TOKEN as string;

const rest = new Discord.REST({ version: '10' }).setToken(token);
const client = new Discord.Client({
  intents: []
});

client.on("ready", async () => {
  console.log(client.user?.username);

  await deployCommand(
    [...commands.values()].map(c => [c.permRoleId, c.slashCommand.toJSON()]),
    process.env.GUILD_ID as string,
    (client.user ?? {}).id as string,
    rest
  );
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    const command = commands.get(interaction.commandName);
    if (
      command &&
      interaction.inGuild() &&
      interaction.guild &&
      interaction.member
    ) {
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
