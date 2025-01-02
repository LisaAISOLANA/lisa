import OpenAI from 'openai';
import { config } from '../config';

export class OpenAIService {
    private openai: OpenAI;
    private readonly referenceImagePath: string;

    constructor() {
        this.openai = new OpenAI({
            apiKey: config.openai.apiKey
        });
        
        this.referenceImagePath = './assets/character_reference.png';
    }

    private getRandomTopic(): string {
        const topics = config.bot.travelTopics;
        return topics[Math.floor(Math.random() * topics.length)];
    }

    async generateTweetContent(): Promise<string> {
        const topic = this.getRandomTopic();
        const completion = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a travel expert sharing inspiring travel content. Create engaging tweets about travel experiences, destinationßs, and tips, including hidden gems about the place. You focus on authenticity and specific details that make your content valuable for travelers. You don't use hashtags and keep your tweets under 280 characters."
                },
                {
                    role: "user",
                    content: `Generate an engaging tweet in English about travel, focusing on ${topic}. Write in first person, using an informal tone as a blogger would do and keep it under 280 characters. Don't use any hashtags and include emoji with the country flag.`
                }
            ],
            max_tokens: 100,
            temperature: 0.8
        });
        return completion.choices[0].message.content || '';
    }

    async generateImage(tweetText: string): Promise<string> {
        // Enhanced prompt that balances subject and landscape visibility
        const prompt = `Create a travel photo that showcases both the subject and the destination:

        Subject:
        - Young East Asian woman with EXACT SAME facial features, hair style, and appearance as the reference image, with casualßß attire matching the local culture
        - Natural, relaxed expression with a hint of a smile
        - Professional, travel-appropriate attire matching the reference style
        - Subject should occupy approximately 1/3 of the frame, positioned to one side
        - Use different cities in the world.

        Landscape/Setting:
        - Location based on: ${tweetText}
        - Landscape should be clearly visible and well-detailed, occupying 2/3 of the ßframe
        - Capture the distinctive features and atmosphere of the location
        - Show depth with foreground, middle ground, and background elements
        - Include emotional elements like vibrant colors, interesting textures and sense of place

        Photography Style:
        - Professional travel photography composition using the rule of thirds
        - Golden hour lighting to enhance both subject and landscape
        - Selective focus: subject sharp, with background slightly softer but still clearly defined
        - High dynamic range to capture details in both bright and shadow areas
        - 4K quality with rich colors and contrast
        - Subject should occupy 1/3 of the frame, positioned to one side, landscape should occupy 2/3 of the frame

        Mood:
        - Authentic travel moment
        - Balance between candid and composed
        - Convey the excitement of exploring the location`;

        const response = await this.openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: "natural"
        });

        return response.data[0].url || '';
    }

    async validateReferenceImage(): Promise<boolean> {
        try {
            // Add validation logic here if needed
            return true;
        } catch (error) {
            console.error('Error validating reference image:', error);
            return false;
        }
    }
}
