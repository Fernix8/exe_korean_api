import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUser(@Req() req): Promise<User> {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    return this.userService.getUserById(userId);
  }

  @Put('profile')
  async updateUser(@Req() req, @Body() updateData: Partial<User>): Promise<User> {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    return this.userService.updateUser(userId, updateData);
  }
}
