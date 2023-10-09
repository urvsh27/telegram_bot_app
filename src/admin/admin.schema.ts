/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  image: string;

  @Prop({ default: true })
  activated: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
