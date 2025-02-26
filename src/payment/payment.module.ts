import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { UserService } from '../user/user.service'; // Import UserService
import { User, UserSchema } from '../user/entities/user.entity'; // Import User entity

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, UserService],
})
export class PaymentModule {}