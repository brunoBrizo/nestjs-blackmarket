import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { StripeService } from '@services/stripe';

@Module({
  imports: [ConfigModule],
  providers: [StripeService],
  exports: [StripeService]
})
export class StripeModule {}
