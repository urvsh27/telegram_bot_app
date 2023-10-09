/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bot extends Document {
  @Prop()
  weatherApiKey: string;

  @Prop({default:false})
  isInitialApiKey: boolean;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
