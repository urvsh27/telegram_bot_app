/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBotService } from './telegramBot';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserController } from './user/user.controller';
config();
@Module({
  imports: [AdminModule, UserModule,DatabaseModule,MongooseModule.forRootAsync({
    useFactory: () => ({
      uri: process.env.MONGODB_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    }),
  }),
  ],
  controllers: [AppController,AdminController, UserController],
  providers: [ AppService,TelegramBotService],
})
export class AppModule {}


