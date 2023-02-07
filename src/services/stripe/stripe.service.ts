import {
  Injectable,
  UnprocessableEntityException,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod } from '@enums/stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private logger: Logger = new Logger('StripeService', { timestamp: true });
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_KEY'), {
      apiVersion: '2022-11-15'
    });
  }

  async createPaymentIntent(
    orderId: string,
    totalAmount: number
  ): Promise<Stripe.PaymentIntent> {
    if (!orderId || totalAmount <= 0) {
      throw new UnprocessableEntityException(
        'The payment intent could not be created'
      );
    }

    try {
      const currency = this.configService.get<string>('STRIPE_CURRENCY');

      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        // Total amount to be sent is converted to cents to be used by the Stripe API
        amount: Number(totalAmount) * 100,
        currency,
        payment_method_types: [PaymentMethod.CARD],
        metadata: { orderId }
      };

      return await this.stripe.paymentIntents.create(paymentIntentParams);
    } catch (error) {
      this.logger.error('Error creating a payment intent', error);
      throw new UnprocessableEntityException(
        'The payment intent could not be created'
      );
    }
  }
}
