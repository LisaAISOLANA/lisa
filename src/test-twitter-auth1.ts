// test-twitter-oauth1.ts
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testOAuth1Tweet() {
    console.log('Iniciando teste com OAuth 1.0a...');

    console.log('\nCriando cliente com OAuth 1.0a User Context...');
    console.log('Chaves de aplicativo:', {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }); 

    // Criando cliente com OAuth 1.0a User Context
    const userClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
        accessToken: process.env.TWITTER_ACCESS_TOKEN!,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });

    try {
        // Primeiro verificamos se o cliente está autenticado corretamente
        console.log('\nVerificando autenticação OAuth 1.0a...');
        const currentUser = await userClient.currentUser();
        console.log(`✅ Autenticado como: @${currentUser.screen_name}`);

        // Tentamos postar um tweet simples
        console.log('\nTentando postar tweet...');
        const tweetText = `Exploring new destinations! Travel test tweet at ${new Date().toISOString()} #TravelBot`;
        
        const tweet = await userClient.v1.tweet(tweetText);
        
        console.log('\n✅ Tweet postado com sucesso!');
        console.log(`ID do Tweet: ${tweet.id_str}`);
        console.log(`Conteúdo: ${tweet.text}`);
        console.log(`Link: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);

        // Se o tweet de texto funcionar, tentamos com uma imagem
        console.log('\nAgora vamos tentar com uma imagem...');
        
        // Usando v1 para upload de mídia
        const mediaId = await userClient.v1.uploadMedia('./test-image.png');
        console.log('✅ Imagem enviada com sucesso');
        
        const tweetWithMedia = await userClient.v1.tweet('Testing travel image upload! 🌍✈️', {
            media_ids: [mediaId]
        });
        
        console.log('\n✅ Tweet com imagem postado com sucesso!');
        console.log(`Link: https://twitter.com/${tweetWithMedia.user.screen_name}/status/${tweetWithMedia.id_str}`);

        return true;
    } catch (error: any) {
        console.error('\n❌ Teste falhou');
        console.error('Detalhes do erro:', {
            message: error.message,
            code: error.code,
            data: error.data,
            description: error.description || 'Sem descrição adicional'
        });
        
        // Informações adicionais para debug
        if (error.data?.errors) {
            console.error('\nErros específicos da API:');
            error.data.errors.forEach((e: any) => {
                console.error(`- Código ${e.code}: ${e.message}`);
            });
        }
        
        return false;
    }
}

// Executa o teste
testOAuth1Tweet().then(success => {
    if (success) {
        console.log('\n✅ Todos os testes completados com sucesso!');
    } else {
        console.log('\n❌ Alguns testes falharam. Verifique os erros acima.');
    }
    process.exit(success ? 0 : 1);
});
