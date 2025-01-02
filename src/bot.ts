import { OpenAIService } from './services/ai';
import { TwitterService } from './services/twitter';
import { config } from './config';

export class TwitterBot {
    private openaiService: OpenAIService;
    private twitterService: TwitterService;
    private isRunning: boolean = false;
    private monthlyTweetCount: number = 0;
    private readonly MAX_MONTHLY_TWEETS = 100; // Ajuste este valor conforme seu orçamento
    private lastResetDate: Date = new Date();

    constructor() {
        this.openaiService = new OpenAIService();
        this.twitterService = new TwitterService();
    }

    private checkMonthlyReset(): void {
        const currentDate = new Date();
        if (currentDate.getMonth() !== this.lastResetDate.getMonth()) {
            this.monthlyTweetCount = 0;
            this.lastResetDate = currentDate;
            console.log('Monthly tweet count reset');
        }
    }

    async generateAndPostTweet(): Promise<void> {
        try {
            this.checkMonthlyReset();

            if (this.monthlyTweetCount >= this.MAX_MONTHLY_TWEETS) {
                console.log('Monthly tweet limit reached. Waiting for next month...');
                return;
            }

            // Generate tweet content about travel
            const tweetText = await this.openaiService.generateTweetContent();
            
            // Generate a matching travel image
            const imageUrl = await this.openaiService.generateImage(tweetText);

            // Post the tweet with the image
            await this.twitterService.postTweet({
                text: tweetText,
                imageUrl: imageUrl
            });

            this.monthlyTweetCount++;
            console.log(`Tweets this month: ${this.monthlyTweetCount}/${this.MAX_MONTHLY_TWEETS}`);

        } catch (error: any) {
            if (error.code === 'insufficient_quota') {
                console.error('OpenAI API quota exceeded. Please check your billing settings.');
                this.stop();
            } else {
                console.error('Error generating and posting tweet:', error);
            }
            throw error;
        }
    }

    start(): void {
        if (this.isRunning) {
            console.log('Bot is already running!');
            return;
        }

        console.log('Travel Twitter Bot started!');
        this.isRunning = true;

        // Post first tweet immediately
        this.generateAndPostTweet();

        // Schedule regular posts
        setInterval(() => {
            this.generateAndPostTweet();
        }, config.bot.tweetInterval);
    }

    stop(): void {
        console.log('Stopping Travel Twitter Bot...');
        this.isRunning = false;
        // Note: You'll need to restart the process to fully stop the intervals
    }
}
