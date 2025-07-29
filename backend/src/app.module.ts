import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/account.module';
import { PaymentsModule } from './payments/payment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AccountsModule, PaymentsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
