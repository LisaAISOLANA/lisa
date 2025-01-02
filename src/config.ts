import dotenv from 'dotenv';
dotenv.config();

export const config = {
    twitter: {
        apiKey: process.env.TWITTER_API_KEY!,
        apiSecret: process.env.TWITTER_API_SECRET!,
        accessToken: process.env.TWITTER_ACCESS_TOKEN!,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY!
    },
    bot: {
        tweetInterval: 180000, // Modificado de 3600000 (1 hora) para 30000 (30 segundos) 600000 (10 minutos) 180000 (3 minutos)
        travelTopics: [
            'hidden gems',
            'cultural experiences',
            'food and cuisine',
            'travel tips',
            'local traditions',
            'scenic spots',
            'budget travel',
            'nomad lifestyle',
            'travel gadgets',
            'sustainable travel',
            'travel tech',
            'travel hacks',
            'travel photography',
            'travel crypto',
            'travel blogging',
            'funny travel stories',
        ]
    }
};

