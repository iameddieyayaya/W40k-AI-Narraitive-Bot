import { SlashCommandBuilder } from 'discord.js';

export const commandNames = {
	add_user: "add_user",
	battle_report: 'battle_report',
	generate_main_crusade_story: 'generate_main_crusade_story',
	progress_narrative: 'progress_narrative'
}

export const commands = [
	new SlashCommandBuilder()
		.setName(commandNames.add_user)
		.setDescription('Add a new user and their faction')
		.addStringOption(option =>
			option.setName('player')
				.setDescription('Player name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('faction')
				.setDescription('Faction name')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName(commandNames.battle_report)
		.setDescription('Report a battle result')
		.addStringOption(option =>
			option.setName('player')
				.setDescription('Player name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('opponent')
				.setDescription('Opponent name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('result')
				.setDescription('win or loss')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName(commandNames.generate_main_crusade_story)
		.setDescription('Setups the main crusade story')
		.addIntegerOption(option =>
			option.setName('weeks')
				.setDescription('Number of weeks to generate')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName(commandNames.progress_narrative)
		.setDescription('Progress the narrative')
		.addIntegerOption(option =>
			option.setName('weeks')
				.setDescription('Number of weeks to remaining in the crusade')
				.setRequired(true))

].map(command => command.toJSON());