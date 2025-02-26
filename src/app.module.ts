import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth-goole/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './payment/payment.module';

console.log("🔍 MONGO_URI:", process.env.MONGODB);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Biến môi trường dùng toàn cục
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    UserModule,
    AuthModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
