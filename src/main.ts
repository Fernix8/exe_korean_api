import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 8000;

  // Enable Swagger
  app.enableCors({
    origin: '*', // Allow all origins (change this for security)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies & authorization headers
  });
  
  const config = new DocumentBuilder()
    .setTitle('NestJS User API')
    .setDescription('API documentation for User CRUD operations')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
app.enableCors({
    origin: 'http://localhost:3000', // Cho phép frontend truy cập
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookie/token qua request
  });
  await app.listen(port);

  // Print Swagger URL in console
  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`📄 Swagger Docs available at: http://localhost:${port}/api`);
}

bootstrap();
