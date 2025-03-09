import { Client, GatewayIntentBits, REST, Routes, CommandInteractionOptionResolver, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import { commandNames, commands } from './commands';
import { initDB, addUser, recordBattle, getAllPlayers } from './database';
import { generateMainCursadeStory } from './openai'


dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', async () => {
  try {
    console.log('Initializing database...');
    await initDB();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log('🔄 Refreshing commands...');
    await rest.put(Routes.applicationCommands(client.user?.id!), { body: commands });
    console.log('✅ Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const options = interaction.options as CommandInteractionOptionResolver;

  if (interaction.commandName === commandNames.add_user) {
    const player = options.getString('player', true);
    const faction = options.getString('faction', true);

    try {
      await addUser(player, faction);
      await interaction.reply(`✅ User added: **${player}** - **${faction}**`);
    } catch (error) {
      console.error('Error handling /add_user:', error);
      await interaction.reply('❌ Failed to add user.');
    }
  }

  if (interaction.commandName === commandNames.battle_report) {
    const player = options.getString('player', true);
    const opponent = options.getString('opponent', true);
    const result = options.getString('result', true);

    try {
      await recordBattle(player, opponent, result);
      await interaction.reply(`✅ Battle recorded: **${player}** vs **${opponent}** - *${result}*`);
    } catch (error) {
      console.error('Error handling /battle_report:', error);
      await interaction.reply('❌ Failed to record battle.');
    }
  }

  if (interaction.commandName === commandNames.generate_main_crusade_story) {
    try {
      await interaction.deferReply(); // Defer the reply to give us more time

      const players = await getAllPlayers();
      let narrative = await generateMainCursadeStory(players, 12);

      const channelId = process.env.NARRATIVE_CHANNEL_ID as string;
      const channel = await client.channels.fetch(channelId);

      if (!narrative) {
        throw new Error("narrative error");
      }

      const maxMessageLength = 2000; // Discord's message length limit
      const chunks: string[] = [];

      // Split the narrative into chunks if it exceeds 2000 characters
      while (narrative.length > maxMessageLength) {
        chunks.push(narrative.slice(0, maxMessageLength));
        narrative = narrative.slice(maxMessageLength);
      }
      chunks.push(narrative); // Add the remaining narrative

      // Send each chunk as a separate message
      if (channel instanceof TextChannel) {
        for (const chunk of chunks) {
          await channel.send({ content: chunk });
        }
      } else {
        console.error('The channel is not a text channel!');
      }

      // Final response to the interaction
      await interaction.editReply({ content: 'Battle narrative generated and posted to the tech channel!' });
    } catch (error) {
      console.error("Error generating narrative: ", error);
      await interaction.editReply({
        content: 'There was an error generating the narrative. Please try again later.',
      });
    }
  }

});

client.login(process.env.DISCORD_TOKEN);