import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AccountsService } from './accounts/account.service';
import { PaymentsService } from './payments/payment.service';
import { Account as AccountModel, Payment as PaymentModel } from '@prisma/client';

describe('AppController (unit)', () => {
  let controller: AppController;

  const mockAccounts: Partial<Record<keyof AccountsService, jest.Mock>> = {
    accounts: jest.fn(),
    account: jest.fn(),
    createAccount: jest.fn(),
    updateAccount: jest.fn(),
  };

  const mockPayments: Partial<Record<keyof PaymentsService, jest.Mock>> = {
    payments: jest.fn(),
    payment: jest.fn(),
    createPayment: jest.fn(),
    updatePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AccountsService, useValue: mockAccounts },
        { provide: PaymentsService, useValue: mockPayments },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => {
    Object.values(mockAccounts).forEach(m => m.mockReset());
    Object.values(mockPayments).forEach(m => m.mockReset());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Accounts endpoints ---

  describe('getAccounts()', () => {
    it('returns an array from accountsService.accounts()', async () => {
      const fake: AccountModel[] = [{ id: 1, name: 'A', address: 'X', phoneNumber: 'Y', bankAccountNumber: '123' } as any];
      mockAccounts.accounts!.mockResolvedValue(fake);

      await expect(controller.getAccounts()).resolves.toBe(fake);
      expect(mockAccounts.accounts).toHaveBeenCalledWith({});
    });
  });

  describe('getAccountById()', () => {
    it('returns a single account with payments', async () => {
      const fake: AccountModel & { payments: PaymentModel[] } = {
        id: 2, name: 'B', address: 'Z', phoneNumber: '1', bankAccountNumber: '456', payments: [],
      } as any;
      mockAccounts.account!.mockResolvedValue(fake);

      await expect(controller.getAccountById('2')).resolves.toBe(fake);
      expect(mockAccounts.account).toHaveBeenCalledWith({
        where: { id: 2 },
        include: { payments: true },
      });
    });

    it('throws NotFoundException when service returns null', async () => {
      mockAccounts.account!.mockResolvedValue(null);
      await expect(controller.getAccountById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('signupUser()', () => {
    it('creates and returns a new account', async () => {
      const dto = { name: 'C', address: 'A', phoneNumber: '2', bankAccountNumber: '789' };
      const created = { id: 3, ...dto } as any;
      mockAccounts.createAccount!.mockResolvedValue(created);

      await expect(controller.signupUser(dto)).resolves.toBe(created);
      expect(mockAccounts.createAccount).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateAccount()', () => {
    it('updates and returns an account when found', async () => {
      const dto = { name: 'D' };
      const updated = { id: 4, name: 'D', address: 'x', phoneNumber: 'y', bankAccountNumber: '0' } as any;
      mockAccounts.updateAccount!.mockResolvedValue(updated);

      await expect(controller.updateAccount('4', dto)).resolves.toBe(updated);
      expect(mockAccounts.updateAccount).toHaveBeenCalledWith({
        where: { id: 4 },
        data: dto,
      });
    });

    it('throws NotFoundException when updateAccount returns null', async () => {
      mockAccounts.updateAccount!.mockResolvedValue(null as any);
      await expect(controller.updateAccount('5', {})).rejects.toThrow(NotFoundException);
    });
  });

  // --- Payments endpoints ---

  describe('getPayments()', () => {
    it('returns an array from paymentsService.payments()', async () => {
      const fake: PaymentModel[] = [{ id: 10, accountId: 1, amount: 5, recipientName: '', recipientBank: '', recipientBAN: '0', status: 1, notes: null, createdAt: new Date() } as any];
      mockPayments.payments!.mockResolvedValue(fake);

      await expect(controller.getPayments()).resolves.toBe(fake);
      expect(mockPayments.payments).toHaveBeenCalledWith({});
    });
  });

  describe('getPaymentById()', () => {
    it('returns a single payment when found', async () => {
      const fake: PaymentModel = { id: 11, accountId: 1, amount: 5, recipientName: '', recipientBank: '', recipientBAN: '0', status: 1, notes: null, createdAt: new Date() } as any;
      mockPayments.payment!.mockResolvedValue(fake);

      await expect(controller.getPaymentById('11')).resolves.toBe(fake);
      expect(mockPayments.payment).toHaveBeenCalledWith({ id: 11 });
    });

    it('throws NotFoundException when service returns null', async () => {
      mockPayments.payment!.mockResolvedValue(null);
      await expect(controller.getPaymentById('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('writePayment()', () => {
    it('creates and returns a new payment', async () => {
      const dto = { accountId: 1, amount: 2, recipientName: 'X', recipientBank: 'Y', recipientBAN: '123', status: 1, notes: 'n' };
      const created = { id: 12, ...dto } as any;
      mockPayments.createPayment!.mockResolvedValue(created);

      await expect(controller.writePayment(dto)).resolves.toBe(created);
      expect(mockPayments.createPayment).toHaveBeenCalledWith(dto);
    });
  });

  describe('updatePayment()', () => {
    it('updates and returns a payment when found', async () => {
      const dto = { accountId: 1, amount: 3, recipientName: 'Z', recipientBank: 'W', recipientBAN: '456', status: 2, notes: '' };
      const updated = { id: 13, ...dto } as any;
      mockPayments.updatePayment!.mockResolvedValue(updated);

      await expect(controller.updatePayment('13', dto)).resolves.toBe(updated);
      expect(mockPayments.updatePayment).toHaveBeenCalledWith({
        where: { id: 13 },
        data: dto,
      });
    });

    it('throws NotFoundException when updatePayment returns null', async () => {
      mockPayments.updatePayment!.mockResolvedValue(null as any);
      await expect(controller.updatePayment('14', {} as any)).rejects.toThrow(NotFoundException);
    });
  });
});
