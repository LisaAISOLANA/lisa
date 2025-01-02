import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config';
import { Tweet } from '../types';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class TwitterService {
    private client: TwitterApi;

    constructor() {
        this.client = new TwitterApi({
            appKey: config.twitter.apiKey,
            appSecret: config.twitter.apiSecret,
            accessToken: config.twitter.accessToken,
            accessSecret: config.twitter.accessTokenSecret,
        });
    }

    private async downloadImage(url: string): Promise<string> {
        const response = await axios({
            url,
            responseType: 'arraybuffer'
        });
        
        // Create a temporary file with a random name
        const tempDir = os.tmpdir();
        const tempFile = path.join(tempDir, `image-${Date.now()}.png`);
        
        // Write the image data to the temporary file
        await fs.promises.writeFile(tempFile, response.data);
        
        return tempFile;
    }

    private async cleanupTempFile(filePath: string): Promise<void> {
        try {
            await fs.promises.unlink(filePath);
            console.log('Temporary file cleaned up:', filePath);
        } catch (error) {
            console.error('Error cleaning up temporary file:', error);
        }
    }

    async postTweet(tweet: Tweet): Promise<void> {
        let tempFilePath: string | null = null;
        
        try {
            if (tweet.imageUrl) {
                // Download the image to a temporary file
                console.log('Downloading image...');
                tempFilePath = await this.downloadImage(tweet.imageUrl);
                console.log('Image downloaded to:', tempFilePath);

                // Upload the image to Twitter
                console.log('Uploading media to Twitter...');
                const mediaId = await this.client.v1.uploadMedia(tempFilePath);
                console.log('Media uploaded successfully, ID:', mediaId);

                // Post the tweet with the media
                await this.client.v2.tweet({
                    text: tweet.text,
                    media: { media_ids: [mediaId] }
                });
            } else {
                await this.client.v2.tweet(tweet.text);
            }

            console.log('Tweet posted successfully!');
            console.log('Content:', tweet.text);
        } catch (error) {
            console.error('Error posting tweet:', error);
            throw error;
        } finally {
            // Clean up the temporary file if it exists
            if (tempFilePath) {
                await this.cleanupTempFile(tempFilePath);
            }
        }
    }
}
