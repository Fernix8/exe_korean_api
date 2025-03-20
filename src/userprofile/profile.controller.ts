import { Controller, Get, Put, Body, Headers, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from '../schemas/user.schema';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class ProfileController {
  constructor(private readonly userService: ProfileService) { }

  @Get('profile')
  async getUser(@Headers('authorization') authHeader: string): Promise<User> {
    const userId = this.extractUserId(authHeader);
    if (!userId) {
      throw new BadRequestException('Invalid or missing token');
    }
    return this.userService.getUser(userId);
  }

  @Put('profile')
  async updateUser(
    @Headers('authorization') authHeader: string,
    @Body() updateData: Partial<User>
  ): Promise<User> {
    const userId = this.extractUserId(authHeader);
    return this.userService.updateUser(userId, updateData);
  }

  private extractUserId(authHeader: string): any {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid or missing token');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET || "my_super_secret_key") as any;
      if (decode && decode.userId) {
        return decode.userId;
      } else {
        throw new BadRequestException('Invalid token');
      }
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}