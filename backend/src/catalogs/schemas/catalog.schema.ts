import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// This type export is crucial for using CatalogDocument in services/repositories
export type CatalogDocument = Catalog & Document;

@Schema({ timestamps: true })
// This class export is crucial for MongooseModule.forFeature and for type inference
export class Catalog {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

// This schema export is crucial for MongooseModule.forFeature
export const CatalogSchema = SchemaFactory.createForClass(Catalog);