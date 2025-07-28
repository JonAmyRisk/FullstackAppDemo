import { Module } from '@nestjs/common';
import { AccountsService } from './account.service';
@Module({
  providers: [AccountsService],
  exports:   [AccountsService],
})
export class AccountsModule {}