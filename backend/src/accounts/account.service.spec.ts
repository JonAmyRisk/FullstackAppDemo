import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account, Payment, Prisma } from '@prisma/client';

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: {
    account: Record<string, jest.Mock>;
  };

  beforeEach(async () => {
    prisma = {
      account: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('account()', () => {
    it('returns the account with payments when found', async () => {
      const mock: Account & { payments: Payment[] } = {
        id: 1,
        name: 'A',
        address: 'Addr',
        phoneNumber: '123',
        bankAccountNumber: BigInt(42) as any,
        payments: [{ id: 5, accountId: 1, amount: 10, recipientName: '', recipientBank: '', recipientBAN: BigInt(0) as any, status: 1, notes: null, createdAt: new Date() }],
      };
      prisma.account.findUnique.mockResolvedValue(mock);

      const result = await service.account({ where: { id: 1 } });
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { payments: true },
      });
      expect(result).toBe(mock);
    });

    it('throws when no account is found', async () => {
      prisma.account.findUnique.mockResolvedValue(null);
      await expect(service.account({ where: { id: 999 } }))
        .rejects.toThrow('Account not found');
    });
  });

  describe('accounts()', () => {
    it('calls findMany with the given params', async () => {
      const list: Account[] = [
        { id: 1, name: 'A', address: 'x', phoneNumber: '1', bankAccountNumber: BigInt(1) as any },
      ];
      prisma.account.findMany.mockResolvedValue(list);

      const params = { skip: 2, take: 3, where: { name: { contains: 'A' } } };
      const result = await service.accounts(params);

      expect(prisma.account.findMany).toHaveBeenCalledWith({
        skip: 2,
        take: 3,
        cursor: undefined,
        where: { name: { contains: 'A' } },
        orderBy: undefined,
      });
      expect(result).toBe(list);
    });
  });

  describe('createAccount()', () => {
    it('calls prisma.account.create with the data', async () => {
      const input: Prisma.AccountCreateInput = {
        name: 'Bob',
        address: 'Addr',
        phoneNumber: '555',
        bankAccountNumber: BigInt(123) as any,
      };
      const created = { id: 2, ...input } as Account;
      prisma.account.create.mockResolvedValue(created);

      const result = await service.createAccount(input);
      expect(prisma.account.create).toHaveBeenCalledWith({ data: input });
      expect(result).toBe(created);
    });
  });

  describe('updateAccount()', () => {
    it('calls prisma.account.update with where and data', async () => {
      const params = {
        where: { id: 3 },
        data: { name: 'NewName' } as Prisma.AccountUpdateInput,
      };
      const updated = { id: 3, name: 'NewName', address: 'x', phoneNumber: '1', bankAccountNumber: BigInt(0) as any } as Account;
      prisma.account.update.mockResolvedValue(updated);

      const result = await service.updateAccount(params);
      expect(prisma.account.update).toHaveBeenCalledWith(params);
      expect(result).toBe(updated);
    });
  });

  describe('deleteAccount()', () => {
    it('calls prisma.account.delete and returns the deleted record', async () => {
      const deleted = { id: 4, name: 'X', address: 'X', phoneNumber: 'X', bankAccountNumber: BigInt(0) as any } as Account;
      prisma.account.delete.mockResolvedValue(deleted);

      const result = await service.deleteAccount({ id: 4 });
      expect(prisma.account.delete).toHaveBeenCalledWith({ where: { id: 4 } });
      expect(result).toBe(deleted);
    });
  });
});
