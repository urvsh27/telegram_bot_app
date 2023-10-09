/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import * as cron from 'node-cron';
import { config } from 'dotenv';
config();
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import { appConfig } from './appConfig';


// Telegram bot token
const TELEGRAM_BOT_TOKEN = appConfig.TELEGRAM_BOT_TOKEN;

// Interface to represent the expected structure of the weather API response
interface WeatherResponse {
  weather: {
    description: string;
  }[];
  main: {
    temp: number,
    humidity : number
  };
  wind : {
    speed : number;
  }
}

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;
  private subscribedUsers: Set<number> = new Set<number>();

  constructor(private readonly adminService: AdminService, private readonly userService: UserService,) {
    
    this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

    this.loadSubscribedUsers();

    this.registerCommands();

    // Cron job to send updates every 3 hour
    cron.schedule('0 */3 * * *', () => {
    console.log("cron sending update");
    this.sendWeatherUpdatesToAll();
});

  }

    private registerCommands() {

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId,'👉 Type \/subscribe to get daily weather updates every 3 hour in your telegram. \n 👉  Type \/unsubscribe to remove subscription.');
    });
    
    this.bot.onText(/\/subscribe/, async (msg) => {
      
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const username = msg.from.username;
  
      const existingUser = await this.userService.getUserByChatId(chatId);
      
  
      if (existingUser) {
        this.bot.sendMessage(chatId, 'You are already registered.');
      } else {
        const user = await this.userService.createUser(userId, username);
        if (user) {
          this.bot.sendMessage(chatId, 'You have been registered.');
          this.subscribedUsers.add(chatId);
          this.sendWeatherUpdate(chatId);
        } else {
          this.bot.sendMessage(chatId, 'Registration failed. Please try again.');
        }
      }
    });
  
    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;
  
      const existingUser = await this.userService.getUserByChatId(chatId);
      if (existingUser) {
        const deletedUser = await this.userService.deleteUser(chatId);
        if (deletedUser) {
          this.subscribedUsers.delete(chatId);
          this.bot.sendMessage(chatId, 'You have been unregistered.');
        } else {
          this.bot.sendMessage(chatId, 'unregistration failed. Please try again.');
        }
      } else {
        this.bot.sendMessage(chatId, 'You are not registered.');
      }
    });
  
  }

  private async sendWeatherUpdate(chatId: number) {

    const weatherApiKey = await this.adminService.getWeatherApiKey();
  
    try {
      const latitude =23.6345;
      const longitude = 78.1128;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`,
      );

      if (!response.ok) {
        Logger.error('Failed to fetch weather data');
        return;
      }

      const data: WeatherResponse = (await response.json()) as WeatherResponse;
      const weatherDescription = data.weather[0]?.description;
      const humidity = data.main['humidity'];
      const temperature = (data.main?.temp - 273.15)?.toFixed(2); 
      const windSpeed = data?.wind['speed']; 
      const message = `Weather in India:\n➡ Weather Description :  ${weatherDescription}\n🌡 Temperature: ${temperature}°C \n 💧 Humidity : ${humidity} % \n 🌬 Wind: ${windSpeed} m/s `;
      this.bot.sendMessage(chatId, message);
    } catch (error) {
      Logger.error('Error fetching weather data', error);
    }
  }

  private async sendWeatherUpdatesToAll() {
    // This function sends weather updates to all subscribed users
    for (const chatId of this.subscribedUsers) {
      this.sendWeatherUpdate(chatId);
    }
  }

  private async loadSubscribedUsers() {
    const users = await this.userService.getUsers();
    users.forEach((user) => {
      this.subscribedUsers.add(user.chatId);
    });
  }
    /*
    {
      coord: { lon: 72.8479, lat: 19.0144 },
      weather: [ { id: 711, main: 'Smoke', description: 'smoke', icon: '50d' } ],
      base: 'stations',
      main: {
        temp: 309.14,
        feels_like: 310.96,
        temp_min: 305.09,
        temp_max: 309.14,
        pressure: 1011,
        humidity: 36
      },
      visibility: 3000,
      wind: { speed: 3.6, deg: 340 },
      clouds: { all: 20 },
      dt: 1696839540,
      sys: {
        type: 1,
        id: 9052,
        country: 'IN',
        sunrise: 1696813246,
        sunset: 1696855862
      },
      timezone: 19800,
      id: 1275339,
      name: 'Mumbai',
      cod: 200
    }*/
}
