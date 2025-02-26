import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth-goole/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/korean_api'), 
    UserModule,
    AuthModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
