/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './admin.schema';
import { Bot } from './bot.schema';
import { appConfig } from 'src/appConfig';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>
) {}
  private initialWeatherApiKey = appConfig.WEATHER_API_KEY;

  async getWeatherApiKey():  Promise<Bot | null | string> {
    const weatherApiKeyDetails: Bot | null = await this.botModel.findOne({isInitialApiKey: true});
    return !weatherApiKeyDetails ? this.initialWeatherApiKey : weatherApiKeyDetails.weatherApiKey;
  }

  async setApiToken( updatedWeatherApiKey: string): Promise<Bot | null > {
    const botDetails: Bot | null = await this.botModel.findOne({isInitialApiKey: true});
    if(botDetails){
      return this.botModel.findByIdAndUpdate(
        botDetails._id,
        { weatherApiKey: updatedWeatherApiKey },
    ).exec();
    }else{
      const newBotToken = new this.botModel({ weatherApiKey : updatedWeatherApiKey, isInitialApiKey: true});
      return newBotToken.save();
    }    
   
}

  async login({
    email,
    name,
    image,
    isAdmin,
  }: {
    email: string;
    name: string;
    image: string;
    isAdmin: boolean;
  }): Promise<any> {
    const user = await this.adminModel.findOne({ email: email });
    if (!user) {
      const newUser = new this.adminModel({ email, name, image, isAdmin });
      await newUser.save();
      return newUser;
    } else {
      return user;
    }
  }
}
