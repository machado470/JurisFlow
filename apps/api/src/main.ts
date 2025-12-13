import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('⏳ Iniciando bootstrap da API...');

    const app = await NestFactory.create(AppModule, {
      cors: true,
      bufferLogs: false,
    });

    console.log('✅ Nest application criada');

    const port = process.env.PORT ? Number(process.env.PORT) : 3000;

    await app.listen(port, '0.0.0.0');

    console.log(`🚀 API rodando em http://0.0.0.0:${port}`);
  } catch (err) {
    console.error('🔥 Erro fatal ao subir a API');
    console.error(err);
    process.exit(1);
  }
}

bootstrap();
