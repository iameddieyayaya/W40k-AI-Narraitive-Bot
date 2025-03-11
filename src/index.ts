import { Client, GatewayIntentBits, REST, Routes, CommandInteractionOptionResolver, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import { commandNames, commands } from './commands';
import { initDB, addUser, recordBattle, getAllPlayers, getBattleResults } from './database';
import { generateMainCursadeStory, progressNarrative } from './openai'


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
    const week = options.getInteger('week', true);

    try {
      await recordBattle(player, opponent, result, week);
      await interaction.reply(`✅ Battle recorded: **${player}** vs **${opponent}** - *${result}*`);
    } catch (error) {
      console.error('Error handling /battle_report:', error);
      await interaction.reply('❌ Failed to record battle.');
    }
  }

  if (interaction.commandName === commandNames.generate_main_crusade_story) {
    try {
      await interaction.deferReply();

      const players = await getAllPlayers();
      const weeks = options.getInteger('weeks', true);

      const mainStory = `
      On the outer edges of Imperium space, a once-forgotten world stirs from its slumber. 
      The long-dormant Tomb world awakens, its blackstone network humming with energy, 
      signaling the start of something far more dangerous. Above the vibrant forests of Enkhiron, 
      the towering hive city of Breakspire casts its looming shadow over the land. 
      The people below, once shielded from the galactic chaos, watch in growing terror as the horrors of war 
      advance toward them. 
      Soon, scything talons, the roar of bolters, and the whine of gauss weapons will descend upon them, 
      as countless forces clash for the prize of this forgotten world.`;

      let narrative = await generateMainCursadeStory(players, weeks, mainStory);

      const channelId = process.env.NARRATIVE_CHANNEL_ID as string;
      const channel = await client.channels.fetch(channelId);

      if (!narrative) {
        throw new Error("narrative error");
      }

      const maxMessageLength = 2000;
      const chunks: string[] = [];


      while (narrative.length > maxMessageLength) {
        chunks.push(narrative.slice(0, maxMessageLength));
        narrative = narrative.slice(maxMessageLength);
      }
      chunks.push(narrative);

      if (channel instanceof TextChannel) {
        for (const chunk of chunks) {
          await channel.send({ content: chunk });
        }
      } else {
        console.error('The channel is not a text channel!');
      }



      await interaction.editReply({ content: 'Battle narrative generated and posted to the tech channel!' });
    } catch (error) {
      console.error("Error generating narrative: ", error);
      await interaction.reply('❌ Failed to generate main narrative.');
    }
  }

  if (interaction.commandName === commandNames.progress_narrative) {
    try {
      await interaction.deferReply();

      const players = await getAllPlayers();
      const weeks = options.getInteger('weeks', true);
      const battleResults = await getBattleResults(weeks)

      let narrative = await progressNarrative(players, weeks, battleResults);

      const channelId = process.env.NARRATIVE_CHANNEL_ID as string;
      const channel = await client.channels.fetch(channelId);

      const maxMessageLength = 2000;
      const chunks: string[] = [];

      if (!narrative) {
        throw new Error("narrative error");
      }

      while (narrative.length > maxMessageLength) {
        chunks.push(narrative.slice(0, maxMessageLength));
        narrative = narrative.slice(maxMessageLength);
      }
      chunks.push(narrative);

      if (channel instanceof TextChannel) {
        for (const chunk of chunks) {
          await channel.send({ content: chunk });
        }
      } else {
        console.error('The channel is not a text channel!');
      }


    } catch (error) {
      console.error('Error handling /progress_narrative:', error);
      await interaction.reply('❌ Failed to progress narrative.');
    }
  }


});

client.login(process.env.DISCORD_TOKEN);