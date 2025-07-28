import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { AccountsService } from './accounts/account.service';
import { Account as AccountModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  //gets a list of all accounts
  @Get('accounts')
  async getAccounts(): Promise<AccountModel[]>{
    return this.accountsService.accounts({});
  }

  //gets a single account (Unused but seems sensible to add to backend for future use)
  @Get('accounts/:id')    
  async getPostById(@Param('id') id: string): Promise<AccountModel> {
    const post = await this.accountsService.account({ id: Number(id) });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  //creates a new account
  @Post('accounts')
  async signupUser(
    @Body() accountData: { 
      name: string,
      address: string,
      phoneNumber: string,
      bankAccountNumber?: number,
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
      bankAccountNumber?: number;
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

  @Delete('accounts/:id')
  @HttpCode(204)
  async deleteAccount(@Param('id') id: string): Promise<void>{
    const exists = await this.accountsService.account({ id: Number(id) });
    if (!exists){
      throw new NotFoundException('Account id ${id} not found');
    }
    await this.accountsService.deleteAccount({id: Number(id)});
  }

}