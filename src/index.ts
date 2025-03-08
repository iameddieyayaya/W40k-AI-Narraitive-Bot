import { Client, GatewayIntentBits, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
import { recordBattle, getFactionStats } from './database';
// import { generateNarrative } from './openai';

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'report') {
        const player = interaction.options.get('player')!.value as string;
        const faction = interaction.options.get('faction')!.value as string;
        const result = interaction.options.get('result')!.value as string;

        await recordBattle(player, faction, result);
        await interaction.reply(`✅ Battle recorded: **${player}** (${faction}) - *${result}*`);

        // Generate narrative update
        const [winningFaction, losingFaction] = await getFactionStats();
        // const story = await generateNarrative(winningFaction, losingFaction)
        const story = 'The narrative update is not available at this time.';

        await interaction.followUp(`📖 **Narrative Update:**\n${story}`);
    }
});

client.login(process.env.DISCORD_TOKEN);