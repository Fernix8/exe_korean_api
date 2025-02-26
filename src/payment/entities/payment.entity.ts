import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, unique: true })
  orderCode: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, enum: ['pending', 'completed'] })
  status: string;

  @Prop() // The key will be generated after payment
  key?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
