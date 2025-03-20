import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Payment, PaymentDocument } from '../payment/entities/payment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,) { }
  
  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        email,
        password
      })
      .exec()
    return user
  }
  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async upgradeToPremium(email: string, orderCode: number): Promise<void> {
    const payment = await this.paymentModel.findOneAndUpdate(
      { orderCode },
      { status: 'completed' },
      { new: true },
    );

    if (!payment) {
      throw new Error('Payment not found for the given orderCode');
    }

    // Upgrade user to premium
    await this.userModel.updateOne(
      { email },
      { isPremium: true },
      { upsert: true }, // Create user if not exists
    );
  }
}
