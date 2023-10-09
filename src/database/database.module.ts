/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './database.provider';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI)],
  providers: [...databaseProviders],
  exports: [MongooseModule], // Export MongooseModule for use in other modules
})
export class DatabaseModule {}
