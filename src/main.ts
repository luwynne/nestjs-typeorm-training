import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() { 
  // this sessions works as middlewares, which means that you 
  //directly wrapps the libs into the application from here
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys:['okasdokkasdokasldk'] //this key can be anything
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
