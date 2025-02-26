import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() body: { amount: number; description: string; email: string }) {
    return this.paymentService.createPayment(body.amount, body.description, body.email);
  }

  @Post('payos-webhook')
  async handleWebhook(@Req() req) {
    return this.paymentService.handleWebhook(req.body);
  }

  @Post('verify')
  async verifyKey(@Body() body: { orderCode: number; key: string }) {
    return this.paymentService.verifyKey(body.orderCode, body.key);
  }

  @Post('cancel')
  async cancelPayment(@Body() body: { orderCode: number }) {
    return this.paymentService.cancelPayment(body.orderCode);
  }

  @Post('verify-order')
  async verifyOrder(@Body() body: { orderCode: number }) {
    return this.paymentService.verifyOrder(body.orderCode);
  }
}