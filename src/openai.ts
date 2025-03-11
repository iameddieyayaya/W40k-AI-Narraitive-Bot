import { OpenAI } from 'openai';
import { extractPdfText } from './pdfReader';
import * as dotenv from 'dotenv';
import { type Player, type BattleResults } from './database'

dotenv.config();

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let crusadeRules = "";

async function loadCrusadeData(pdfUrl: string) {
  crusadeRules = await extractPdfText(pdfUrl);
  console.log({ crusadeRules });
}

loadCrusadeData("./wh40k10ed_pariah-nexus.pdf");


async function generateMainCursadeStory(players: Player[], campaignDuration: number, textSuggestion?: string) {
  const prompt = `
    You are the narrator for a Warhammer 40k Pariah Nexus Crusade campaign. The war is growing fiercer with every passing day, and the three primary factions are at each other’s throats, each with their own ambitions, goals, and strategies. The **Imperium**, **Xenos**, and **Chaos** factions are locked in a deadly struggle, but the lines between them are not always as clear-cut as they seem. 

    **Imperium**: Humanity’s defenders, divided but determined. The Imperium's military might is vast, but internally, the various factions are splintering. The Adeptus Astartes and Astra Militarum clash in their pursuit of different war strategies, while the Adeptus Mechanicus seeks to control ancient technologies, even if it means betraying their allies.

    **Xenos**: Alien species with motives as varied as their kinds. Some wish to conquer the galaxy, others to destroy humanity, while some might seek to manipulate or corrupt the powers of the **Pariah Nexus** for their own gains. The **Aeldari**, **Tyranids**, **Necrons**, and other Xenos races fight among themselves as much as they fight against their foes, ever plotting in the shadows.

    **Chaos**: The forces of the Dark Gods, each seeking to bring about their own twisted vision of the universe. The **Chaos Space Marines**, **Daemons**, and other servants of the Dark Gods fight to spread corruption and undo the Imperium’s influence over the galaxy. But even within Chaos, there is infighting—Khorne, Tzeentch, Nurgle, and Slaanesh each demand sacrifices, and their rivalries only add to the madness.

    Even as these three factions battle, they also face internal challenges that threaten to unravel their efforts. As the crusade continues, new alliances are formed, broken, and reformed. Some factions within each group may even turn on their own. The **Pariah Nexus**—a site of ancient, dark power—twists the minds of all those who seek it. Those who dare to enter this cursed region must confront their deepest fears, desires, and doubts.

    With these shifting allegiances, your task is to create a narrative that explains the **crusade’s progression** and the changing fortunes of each faction.

    - **Campaign Duration**: ${campaignDuration} weeks
    - **Players and Factions**:
      ${players.map(player => `${player.name} (Faction: ${player.faction})`).join("\n")}

    - **Text Suggestion**: ${textSuggestion}

    ### Your Narrative Should Include:
    1. **The Stakes**: What is each faction fighting for? Is it survival, dominance, or the power of the **Pariah Nexus** itself? What is at risk if they fail?
    2. **Faction Rivalries and Intrigue**: Highlight any conflicts between factions within the same category (Imperium, Xenos, Chaos) as they fight for their own agendas.
    3. **The Outcome of Recent Games**: Describe the results of the last battles, and how the outcomes have shifted the balance of power between the factions.
    4. **Narrative Development**: As the campaign progresses, increase the intensity of the events. If the campaign is nearing the end, ramp up the stakes and build toward an epic final conflict. If it’s the beginning, establish the setting, the key players, and the first clashes.
    5. **Plot Twists and Betrayals**: Unexpected twists in the war could dramatically change the direction of the conflict. An unlikely ally could turn on their partner, or an ancient artifact could be uncovered, altering the course of the crusade.
    6. **The Current State of the Pariah Nexus**: The Nexus itself is warping and changing as the battle rages on. The planet might be deteriorating, ancient secrets are being uncovered, and new threats are emerging. How does the Nexus affect the factions’ plans and alliances?

    Your response should provide an exciting, ever-changing story that adapts to the current state of the campaign and builds tension toward an ultimate showdown between the factions.
	`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: 'You are a helpful narrator for a Warhammer 40k campaign.' },
        { role: 'user', content: prompt }
      ],
      store: true,
    });

    console.log(response.usage)


    return response.choices[0].message.content;

  } catch (error) {
    console.error('Error generating narrative:', error);
    return 'An error occurred while generating the narrative.';
  }
}

async function progressNarrative(players: Player[], campaignDuration: number, battleResults: BattleResults[]) {
  const prompt = `
    You are continuing the narrative for the Warhammer 40k Pariah Nexus Crusade campaign. The crusade has progressed, and the war has grown even more intense as the factions push towards their ultimate goals. With each passing week, the stakes have increased, the alliances have fractured, and new forces have emerged. The crusade is divided into three main factions: 

    1. **Imperium**: The defenders of humanity, driven by faith, loyalty, and desperate survival in the face of overwhelming odds.
      - Includes: Adeptus Astartes, Astra Militarum, Adeptus Mechanicus, and other factions of the Imperium.
    2. **Xenos**: Alien races with their own motivations, seeking to dominate, eradicate, or subjugate the galaxy.
      - Includes: Aeldari, Tyranids, Necrons, and other Xenos factions.
    3. **Chaos**: The forces of the Dark Gods, driven by corruption, madness, and a hunger to undo the very fabric of existence.
      - Includes: Chaos Space Marines, Daemons, and other factions of the Chaos.

    While these three categories define the broad strokes of the conflict, the factions within them are constantly shifting and at times may even come into direct conflict with each other. The lines are not so simple, and the motivations of each faction can lead to unexpected clashes.

    Based on the following details, expand and evolve the story of the crusade. This new chapter reflects the aftermath of recent battles, the changing motivations of each faction, and the growing threats of the Pariah Nexus.

    - **Campaign Duration**: The length of the campaign is ${campaignDuration} weeks.
    - **Players and Factions**:
      ${players.map(player => `${player.name} (Faction: ${player.faction})`).join("\n")}
    - **Battle Results**:
      ${battleResults.map(result => `${result.player} vs. ${result.opponent} - Result: ${result.result}`).join("\n")}

    ### Story Progression:

    1. **Recent Match Outcomes and the Changing Balance of Power**:
      - The last battle was a bloodbath, and its outcome has altered the balance of power significantly. Whether it was the devastation of a key faction or the shocking resurgence of an underdog, the war has taken an unexpected turn.
      - The aftermath of the battle has left scars on the land, twisting the environment and influencing the strategies of the factions. Perhaps the planet has become unstable, or new, terrifying phenomena have emerged in the wake of the conflict.

    2. **Faction Shifts**:
      - The factions are divided into three categories, but this doesn't mean they always fight together. The **Imperium** faces internal fractures as factions such as the Astra Militarum and Adeptus Mechanicus clash in their pursuit of differing goals, while the **Xenos** may find themselves in tense competition over valuable resources or ancient artifacts. Meanwhile, **Chaos** is a realm of constant strife, with the forces of Nurgle, Tzeentch, and Khorne locked in their own brutal rivalries.
      - For example, the **Imperium** might be fighting an all-out war against the **Xenos**, but the Astra Militarum might also be directly at odds with the Adeptus Astartes, questioning their place in the larger scheme of things. Similarly, Chaos factions might briefly join forces to overwhelm a common enemy but soon descend into their eternal internal struggles.
      
    3. **Plot Twists and Surprises**:
      - New factions or forces could emerge, potentially aligned with or opposed to the current powers. Perhaps the remnants of an ancient Xenos race, long dormant, are awakening and threatening to consume everything in their path.
      - The **Pariah Nexus** itself has strange, almost sentient qualities. Could its shifting, malevolent energies begin to take a physical toll on the combatants, leading to unexpected consequences, such as mutations or psyker-like powers being unleashed in the midst of the battle?

    4. **Critical Decisions**:
      - The players face a critical decision this week. The choices they make could have lasting consequences. Will they continue to fight for their original goals, or will the dire circumstances force them into a fragile alliance with a once-foe? Will they sacrifice everything to secure their victory, or risk it all for a new, uncertain path?
      - Perhaps a **Chaos** faction proposes a temporary truce with the **Xenos** to eliminate a more significant threat—only for that truce to dissolve into chaos once their common enemy is dealt with.

    5. **The Building Tension and Growing Threats**:
      - As the campaign nears its climax, the tension builds. The environment is warping, the forces are shifting, and old allegiances are being tested. A great battle looms on the horizon, one that will decide the fate of the **Pariah Nexus**.
      - The factions can feel it—the endgame is approaching, and everyone is scrambling to gain the advantage. The forces of **Chaos** are pushing harder to break the will of the **Imperium**, while the **Xenos** plot their next move, seeking to exploit the chaos. The **Tyranids** are on the verge of consuming all, their Hive Mind shifting ever closer to a terrifying new evolution.

    6. **An Epic Conclusion**:
      - When campaign duration reaches its end, the final battle will be upon us. The players must face their ultimate challenge, their destinies intertwined with the fate of the galaxy. The **Pariah Nexus** will reveal its darkest secrets, and the victors will shape the future of the 41st millennium.
      - What happens now could reshape the future of the **Pariah Nexus** and the galaxy at large. The players must confront their fate, their alliances, and their deepest fears. Will they emerge victorious or be consumed by the endless war that defines the grimdark future of the 41st millennium?

    Provide a new narrative that continues the story, focusing on how the factions are responding to these new developments. Reflect on the changes in the landscape, the motivations of the players, and the escalating tensions as the crusade draws toward its final, decisive battles.

    Your response should include:
    1. **Recommended Match Pairings for the Next Week; They will most likely be random**: This will set the stage for an explosive showdown, with alliances shifting and new rivalries emerging.
    2. **The Outcome of the Most Recent Games**: A twist or shift in the factions' fortunes could alter everything, leading to a new balance of power.
    3. **An Evolving Narrative**: The story should reflect the chaos and shifting allegiances of the campaign, escalating the stakes as the final battles approach.
    4. **Epic Encounters or Revelations**: Major events that could change the course of the war, such as the emergence of a hidden faction, an ancient artifact's discovery, or a betrayal that shatters alliances.
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: 'You are a helpful narrator for a Warhammer 40k campaign.' },
        { role: 'user', content: prompt }
      ],
      store: true,
    });

    console.log(response.usage)


    return response.choices[0].message.content;

  } catch (error) {
    console.error('Error generating narrative:', error);
    return 'An error occurred while generating the narrative.';
  }
}

async function resetNarrative() {
  await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: 'system', content: 'You are a helpful narrator for a Warhammer 40k campaign. The previous narrative is now erased. Start fresh with a new story.' }
    ]
  });
}

export { generateMainCursadeStory, progressNarrative, resetNarrative };