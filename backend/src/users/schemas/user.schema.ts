import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // El 'sub' claim del token de Auth0. Es el identificador único del usuario.
  @Prop({ required: true, unique: true, index: true })
  auth0Id: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop([String])
  roles: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);