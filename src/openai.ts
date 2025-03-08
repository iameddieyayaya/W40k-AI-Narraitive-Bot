import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

export async function generateNarrative(winningFaction: string, losingFaction: string): Promise<string> {
    const prompt = `In the grim darkness of the far future, the ${winningFaction} have won a decisive battle against the ${losingFaction}. Describe the aftermath.`;

    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are a Warhammer 40k campaign storyteller.' },
            { role: 'user', content: prompt }
        ]
    });

    return response.data.choices[0].message?.content || "The battlefield remains silent, awaiting the next war.";
}