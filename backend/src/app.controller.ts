import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { AccountsService } from './accounts/account.service';
import { Account as AccountModel } from '@prisma/client';
import { PaymentsService } from './payments/payment.service';
import { Payment as PaymentModel } from '@prisma/client';


@Controller()
export class AppController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  //gets a list of all accounts
  @Get('accounts')
  async getAccounts(): Promise<AccountModel[]>{
    return this.accountsService.accounts({});
  }

  //gets a single account (Unused but seems sensible to add to backend for future use)
  @Get('accounts/:id')
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.account({
      where: { id: Number(id) },
      include: { payments: true },
    });
}

  //creates a new account
  @Post('accounts')
  async signupUser(
    @Body() accountData: { 
      name: string,
      address: string,
      phoneNumber: string,
      bankAccountNumber?: string,
     },
  ): Promise<AccountModel> {
    return this.accountsService.createAccount(accountData);
  }

  //updates an existing account
  @Put('accounts/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body() accountData: {
      name?: string;
      address?: string;
      phoneNumber?: string;
      bankAccountNumber?: string;
    }
  ): Promise<AccountModel> {
    const updated = await this.accountsService.updateAccount({
      where: {id: Number(id)},
      data: accountData,
    });
    if (!updated){
      throw new NotFoundException('Account id ${id} not found');
    }
    return updated;
  }

  /*Deletes an account, although this wont work out of the box due to Payments relation, added as a stub for CRUD
  //Would need refined requirements for what to do with orphaned payments
  @Delete('accounts/:id')
  @HttpCode(204)
  async deleteAccount(@Param('id') id: string): Promise<void>{
    const exists = await this.accountsService.account({ id: Number(id) });
    if (!exists){
      throw new NotFoundException('Account id ${id} not found');
    }
    await this.accountsService.deleteAccount({id: Number(id)});
  }
  */

  //gets a list of all payments
  @Get('payments')
  async getPayments(): Promise<PaymentModel[]>{
    return this.paymentsService.payments({});
  }

  //gets a payment by id
  @Get('payments/:id')    
  async getPaymentById(@Param('id') id: string): Promise<PaymentModel> {
    const post = await this.paymentsService.payment({ id: Number(id) });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }
  
  //creates a payment entry
  @Post('payments')
  async writePayment(
    @Body() paymentData: {
      accountId: number;
      amount: number;
      recipientName: string;
      recipientBank: string;
      recipientBAN: string;
      status: number;
      notes?: string;
    },
  ): Promise<PaymentModel> {
    return this.paymentsService.createPayment(paymentData);
  }

  @Put('payments/:id')
  async updatePayment(
    @Param('id') id: string,
    @Body() paymentData: {
      accountId: number;
      amount: number;
      recipientName: string;
      recipientBank: string;
      recipientBAN: string;
      status: number;
      notes?: string;
    }
  ): Promise<PaymentModel> {
    const updated = await this.paymentsService.updatePayment({
      where: {id: Number(id)},
      data: paymentData,
    });
    if (!updated){
      throw new NotFoundException('Payment id ${id} not found');
    }
    return updated;
  }

}