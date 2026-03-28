import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 1. Criamos a instância do Express fora
const server = express();

export const createNextServer = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // IMPORTANTE: Se você tiver um prefixo global, lembre-se dele aqui:
  // app.setGlobalPrefix('api');

  await app.init();
  return app;
};

// 2. Exportamos a função que a Vercel vai chamar
export default async (req: any, res: any) => {
  await createNextServer(server);
  server(req, res);
};

// 3. Suporte para rodar localmente (npm run start:dev)
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  }
  bootstrap();
}