import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testTwitterAuth() {
    console.log('Starting Twitter API authentication test...');

    // Create client with only app keys first
    const appOnlyClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
    });

    try {
        // First, try app-only authentication
        console.log('\nTesting App-only authentication...');
        const appOnlyAuthClient = await appOnlyClient.appLogin();
        console.log('✅ App-only authentication successful');

        // Now test user authentication
        console.log('\nTesting User authentication...');
        const userClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY!,
            appSecret: process.env.TWITTER_API_SECRET!,
            accessToken: process.env.TWITTER_ACCESS_TOKEN!,
            accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
        });

        // Try to get authenticated user's information
        const me = await userClient.v2.me();
        console.log('✅ User authentication successful');
        console.log(`Authenticated as: ${me.data.username}`);

        // Test read permissions
        console.log('\nTesting read permissions...');
        const tweets = await userClient.v2.userTimeline(me.data.id);
        console.log('✅ Read permissions working');

        // Test write permissions with a test tweet
        console.log('\nTesting write permissions...');
        const tweet = await userClient.v2.tweet('Test tweet - will be deleted immediately');
        console.log('✅ Write permissions working');
        
        // Clean up test tweet
        await userClient.v2.deleteTweet(tweet.data.id);
        console.log('✅ Test tweet deleted successfully');

        return true;
    } catch (error: any) {
        console.error('\n❌ Authentication test failed');
        console.error('Error details:', {
            message: error.message,
            code: error.code || 'No code provided',
            data: error.data || 'No data provided',
            type: error.type || 'No type provided',
            rateLimit: error.rateLimit || 'No rate limit info'
        });
        return false;
    }
}

// Run the test
testTwitterAuth().then(success => {
    if (success) {
        console.log('\n✅ All Twitter authentication tests passed successfully!');
    } else {
        console.log('\n❌ Twitter authentication tests failed. Please check the error details above.');
    }
    process.exit(success ? 0 : 1);
});
