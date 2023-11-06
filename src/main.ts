import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: ['debug', 'error', 'log', 'verbose', 'warn']
  });

  app.enableCors({
    methods: '*',
    origin: '*',
  });
  app.setGlobalPrefix('api')

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Financiamento API')
    .setDescription('API para interação com os recursos da aplicação')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT',
      in: 'header'
    },
    'JWT-auth'
    )
    .build()
  const SwaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, SwaggerDocument);

  await app.listen(process.env.APP_PORT);
}

bootstrap();
