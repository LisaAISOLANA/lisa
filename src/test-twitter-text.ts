// test-twitter-text.ts
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testTextOnlyTweet() {
    console.log('Iniciando teste de tweet apenas com texto...');

    const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
        accessToken: process.env.TWITTER_ACCESS_TOKEN!,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });

    try {
        // Primeiro, vamos verificar se podemos obter informações do usuário
        console.log('Verificando autenticação...');
        const me = await client.v2.me();
        console.log(`Autenticado como: @${me.data.username}`);

        // Agora vamos tentar postar um tweet simples
        console.log('\nTentando postar um tweet de texto...');
        const tweet = await client.v2.tweet(
            'Este é um tweet de teste do nosso bot de viagens! #TesteTecnico'
        );

        console.log('\n✅ Tweet postado com sucesso!');
        console.log(`ID do Tweet: ${tweet.data.id}`);
        console.log(`Você pode ver o tweet em: https://twitter.com/anyuser/status/${tweet.data.id}`);

        return true;
    } catch (error: any) {
        console.error('\n❌ Teste falhou');
        console.error('Detalhes do erro:', {
            message: error.message,
            code: error.code,
            data: error.data
        });
        return false;
    }
}

// Executar o teste
testTextOnlyTweet().then(success => {
    if (success) {
        console.log('\nTeste completo: Tweet de texto funcionou!');
    } else {
        console.log('\nTeste falhou: Não foi possível postar o tweet');
    }
    process.exit(success ? 0 : 1);
});
