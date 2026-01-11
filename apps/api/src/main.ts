import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)

    const port = process.env.PORT || 3000
    await app.listen(port)

    console.log('🚀 API ONLINE NA PORTA', port)
  } catch (err) {
    console.error('🔥 ERRO NO BOOTSTRAP', err)
    process.exit(1)
  }
}

/**
 * 🧨 CAPTURA ERROS SILENCIOSOS (OBRIGATÓRIO)
 */
process.on('unhandledRejection', (reason) => {
  console.error('🔥 UNHANDLED REJECTION', reason)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION', err)
  process.exit(1)
})

bootstrap()
