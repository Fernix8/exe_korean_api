import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import PayOS from "@payos/node";
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';

dotenv.config();

@Injectable()
export class PaymentService {
  private readonly payOS: PayOS;
  private readonly YOUR_DOMAIN = 'https://korean-elearning.vercel.app';

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly userService: UserService, // Inject UserService
  ) {
    this.payOS = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  generateRandomKey(): string {
    return crypto.randomBytes(6).toString('hex');
  }

  async sendEmail(email: string, key: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Payment Confirmation Key',
      text: `Thank you for your payment! Your confirmation key is: ${key}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email} with key: ${key}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPayment(amount: number, description: string, email: string): Promise<any> {
    const orderCode = Number(String(Date.now()).slice(-6));

    const body = {
      orderCode,
      amount,
      description,
      returnUrl: `${this.YOUR_DOMAIN}/success`,
      cancelUrl: `${this.YOUR_DOMAIN}/cancel`,
    };

    try {
      const paymentLinkResponse = await this.payOS.createPaymentLink(body);

      await this.paymentModel.create({
        orderCode,
        email,
        status: 'pending',
      });

      return { checkoutUrl: paymentLinkResponse.checkoutUrl, orderCode };
    } catch (error) {
      throw new HttpException('Payment creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async handleWebhook(data: any): Promise<any> {
    const webhookData = this.payOS.verifyPaymentWebhookData(data);

    if (webhookData.desc === 'success') {
      const key = this.generateRandomKey();

      const payment = await this.paymentModel.findOneAndUpdate(
        { orderCode: webhookData.orderCode },
        { status: 'completed', key },
        { new: true },
      );

      if (!payment) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      await this.sendEmail(payment.email, key);

      return { message: 'Payment confirmed, key sent via email' };
    }

    throw new HttpException('Payment not completed', HttpStatus.BAD_REQUEST);
  }

  async verifyKey(orderCode: number, key: string): Promise<any> {
    const payment = await this.paymentModel.findOne({ orderCode });

    if (!payment) {
      throw new HttpException('Invalid order code', HttpStatus.NOT_FOUND);
    }

    if (payment.key !== key) {
      throw new HttpException('Invalid key', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'Payment successfully verified' };
  }

  async cancelPayment(orderCode: number): Promise<any> {
    const payment = await this.paymentModel.findOne({ orderCode });

    if (!payment) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (payment.status === 'completed') {
      throw new HttpException('Cannot cancel a completed payment', HttpStatus.BAD_REQUEST);
    }

    await this.paymentModel.updateOne({ orderCode }, { status: 'cancelled' });

    return { message: 'Payment cancelled successfully' };
  }

  async verifyOrder(orderCode: number): Promise<any> {
    const payment = await this.paymentModel.findOne({ orderCode });

    if (!payment || payment.status === 'completed') {
      throw new HttpException('Invalid or already processed order', HttpStatus.BAD_REQUEST);
    }

    // Upgrade user to premium
    await this.userService.upgradeToPremium(payment.email, orderCode);

    return { message: 'Order verified, user upgraded to premium' };
  }
}