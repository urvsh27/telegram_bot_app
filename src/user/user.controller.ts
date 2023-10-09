/* eslint-disable prettier/prettier */
import { Controller, Get, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Delete(':chatId')
  async deleteUser(@Param('chatId') chatId: number) {
    const deletedUser = await this.userService.deleteUser(chatId);
    if (deletedUser) {
      return { success: true, message: 'User deleted successfully' };
    }
  }
}
