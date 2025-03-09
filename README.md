# Warhammer 40k Narrative Bot

A **Discord bot** for **Warhammer 40k Crusade** campaigns, designed to track battle results and generate immersive, AI-powered narratives based on player performance. This bot helps create a dynamic and engaging storytelling experience as players report victories and losses, with the bot adapting the narrative in real time.

## 🚀 Features

- **Battle Tracking**: Players can report their battles (win/loss) and factions.
- **Adaptive Narratives**: The bot generates campaign updates based on battle outcomes.
- **Thematic War Reports**: Post-battle lore and updates that fit the Warhammer 40k universe.
- **Faction Stats**: See how different factions are performing in the crusade.
- **OpenAI Integration**: Uses GPT-4 to create immersive stories based on in-game events.

## 📦 Technologies Used

- **Discord.js**: The library for interacting with the Discord API.
- **TypeScript**: A statically typed language for improved development.
- **OpenAI**: Used to generate narrative and storylines.
- **SQLite**: A lightweight database to track battle data.
- **dotenv**: For securely managing environment variables.

## 🔧 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/warhammer-narrative-bot.git
   cd warhammer-narrative-bot
   ```
2.	**Install dependencies**:

    ```bash
    npm install
    ```
3.	**Create a .env file** in the root of the project with the following keys:

    ```bash
    DISCORD_TOKEN=your_discord_bot_token
    OPENAI_API_KEY=your_openai_api_key
    ```

4.	**Run the bot**:

    ```bash
    npm run start
    ```

**🎮 Commands**
	•	/report - Record a battle result (win/loss) for a player and faction.
Example usage: /report player:"JohnDoe" faction:"Space Marines" result:"win"
	•	/stats - View faction performance statistics.

**🛠 Development**

To contribute to the development of the Warhammer 40k Narrative Bot, follow these steps:
	1.	Fork the repository to your own GitHub account.
	2.	Clone the forked repository:
    
        ```bash
            git clone https://github.com/your-username/warhammer-narrative-bot.git
        ```

    3.	Make your changes and create a pull request.

**🔒 License**

This project is licensed under the MIT License - see the LICENSE file for details.

**👥 Contributors**
	•	Your Name - Initial Bot Development
	•	OpenAI - For AI-powered narrative generation

**💬 Support**

If you have any issues, feel free to open an issue on GitHub or contact us via Discord.

**Disclaimer**: This bot is not officially affiliated with Warhammer 40k or Games Workshop. It is a fan-made project designed to enhance the Warhammer 40k Crusade experience.
