# AI Travel Twitter Bot

An automated Twitter bot that generates and posts travel-related content using OpenAI's GPT-3.5 and DALL-E 3 APIs.

## Features

- Generates engaging travel-related tweets using GPT-3.5
- Creates matching travel images using DALL-E 3
- Maintains consistent posting schedule
- Enforces monthly tweet limits
- Handles image downloads and Twitter media uploads
- Includes travel topics rotation

## Prerequisites

- Node.js and npm installed
- Twitter Developer Account with API credentials
- OpenAI API key
- Character reference image for DALL-E 3

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
OPENAI_API_KEY=your_openai_api_key
```

4. Place your character reference image at `./assets/character_reference.png`

## Configuration

Adjust the bot settings in `config.ts`:

- `tweetInterval`: Time between posts (default: 3 minutes)
- `MAX_MONTHLY_TWEETS`: Monthly tweet limit (default: 100)
- `travelTopics`: List of topics for tweet generation

## Usage

Start the bot:
```bash
npm start
```

The bot will:
1. Generate travel-related tweet content
2. Create a matching image featuring your reference character
3. Post the tweet with the image
4. Repeat based on configured interval

## Services

### OpenAIService
Handles interaction with OpenAI APIs for:
- Text generation using GPT-3.5
- Image generation using DALL-E 3

### TwitterService
Manages Twitter functionality:
- Media upload
- Tweet posting
- Image downloading

## Error Handling

- Monitors API quota limits
- Handles temporary file cleanup
- Includes error logging
- Implements monthly tweet limits

## License

MIT
