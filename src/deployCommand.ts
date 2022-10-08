import Discord from "discord.js";

export default async function deployCommand(
  commands: [string | null, ReturnType<Discord.SlashCommandBuilder["toJSON"]>][],
  guildId: string,
  clientId: string,
  rest: Discord.REST
) {
  try {
    const data = await rest.put(Discord.Routes.applicationGuildCommands(clientId, guildId), { body: commands.map(c => c[1]) }) as any;
    console.log(`Deploied ${data.length} commands!`);
    // const guild = await client.guilds.fetch(guildId);
    // const guildCommands = [...(await guild.commands.fetch()).values()];
    // for (const command of guildCommands) {
    //   const reqRole = (commands.find(c => c[1].name === command.name) ?? [])[0];
    //   if (!reqRole) continue;
    //   await command.permissions.set({
    //     permissions: [
    //       {
    //           id: reqRole,
    //           type: 1,
    //           permission: false,
    //       },
    //     ],
    //     token
    //   });
    // }
  } catch (e) {
    throw new Error(e as any);
  }
}
