/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(chatId: number, username: string): Promise<User> {
    const user = new this.userModel({ chatId, username });
    return await user.save();
  }

  async deleteUser(chatId: number): Promise<User | null> {
    return await this.userModel.findOneAndDelete({ chatId }).exec();
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUserByChatId(chatId: number): Promise<User | null> {
    return await this.userModel.findOne({ chatId }).exec();
  }
}
