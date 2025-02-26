import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(): Promise<User> {
    return this.userModel.findOne();
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }
}
