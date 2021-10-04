import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { User } from './user.entity';

@Schema({ versionKey: false })
export class Movie extends Document {

  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  description: String;

  @Prop({ required: true })
  manager: String;

  @Prop({ required: true })
  entranceCost: Number;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: Array })
  userLikes: string[];

  @Prop({ type: Boolean, default: false })
  public: Boolean;

  @Prop({ type: Number, default: 0 })
  like: Number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User | Types.ObjectId;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
