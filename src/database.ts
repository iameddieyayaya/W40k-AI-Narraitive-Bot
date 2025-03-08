import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
    filename: './crusade.db',
    driver: sqlite3.Database
});

// Initialize the database
export async function initDB() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS battles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player TEXT,
            faction TEXT,
            result TEXT
        );
    `);
}

// Record a battle
export async function recordBattle(player: string, faction: string, result: string) {
    const db = await dbPromise;
    await db.run(`INSERT INTO battles (player, faction, result) VALUES (?, ?, ?)`, [player, faction, result]);
}

// Get faction performance
export async function getFactionStats(): Promise<[string, string]> {
    const db = await dbPromise;

    const wins = await db.get(`SELECT faction FROM battles WHERE result='win' GROUP BY faction ORDER BY COUNT(*) DESC LIMIT 1`);
    const losses = await db.get(`SELECT faction FROM battles WHERE result='loss' GROUP BY faction ORDER BY COUNT(*) DESC LIMIT 1`);

    return [wins?.faction || 'Unknown', losses?.faction || 'Unknown'];
}