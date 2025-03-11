import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export interface Player {
	id?: number
	name: string;
	faction: string;
}

export interface BattleResults { 
	player: string; 
	opponent: string; 
	faction: string; 
	result: string; 
	week: number }

interface Faction {
	name: string;
}


const dbPromise = open({
	filename: './crusade.db',
	driver: sqlite3.Database
});

export async function initDB() {
	const db = await dbPromise;
	try {
		// Ensure both tables are created (battles and users)
		await db.exec(`
      CREATE TABLE IF NOT EXISTS battles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player TEXT NOT NULL,
        faction TEXT NOT NULL,
        result TEXT CHECK(result IN ('win', 'loss')) NOT NULL
				week INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player TEXT UNIQUE NOT NULL,
        faction TEXT NOT NULL
      );
    `);
		console.log('Tables created or already exist.');
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}

export async function addUser(player: string, faction: string): Promise<Player> {
	const db = await dbPromise;

	try {
		// Insert the user into the database
		const result = await db.run(`INSERT INTO users (player, faction) VALUES (?, ?)`, [player, faction]);

		console.log(`User ${player} added with faction ${faction}`);

		// Return the Player object with the inserted ID
		const addedPlayer: Player = {
			id: result?.lastID, // The last inserted row's ID
			name: player,
			faction,
		};

		return addedPlayer;

	} catch (error: any) {
		if (error.code === 'SQLITE_CONSTRAINT') {
			throw new Error(`User **${player}** already exists in the database.`);
		}

		console.error('Error adding user:', error);
		throw new Error('Failed to add user. Please try again later.');
	}
}

export async function recordBattle(player: string, opponent: string, result: string, week: number) {
	const db = await dbPromise;
	await db.run(
		`INSERT INTO battles (player, opponent, result, week) VALUES (?, ?, ?, ?)`,
		[player, opponent, result, week]
	);
}

export async function getBattleResults(week?: number): Promise<BattleResults[]> {
	const db = await dbPromise;

	let query = `SELECT player, opponent, faction, result, week FROM battles`;
	const params: (string | number)[] = [];

	if (week) {
		query += ` WHERE week = ?`;
		params.push(week);
	}

	return await db.all(query, params);
}

export async function getFactionStats(): Promise<{ topWinFaction: string; topLossFaction: string }> {
	const db = await dbPromise;

	const winData = await db.get(
		`SELECT faction FROM battles WHERE result='win' GROUP BY faction ORDER BY COUNT(*) DESC LIMIT 1`
	);
	const lossData = await db.get(
		`SELECT faction FROM battles WHERE result='loss' GROUP BY faction ORDER BY COUNT(*) DESC LIMIT 1`
	);

	return {
		topWinFaction: winData?.faction || 'Unknown',
		topLossFaction: lossData?.faction || 'Unknown'
	};
}

export async function getAllPlayers(): Promise<Player[]> {
	const db = await dbPromise;
	return await db.all(`SELECT player, faction FROM users`);
}

export async function getFactions(): Promise<{ faction: string }[]> {
	const db = await dbPromise;
	return await db.all(`SELECT DISTINCT faction FROM battles`);
}