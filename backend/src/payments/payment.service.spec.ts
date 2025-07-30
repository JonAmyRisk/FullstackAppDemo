import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payment.service';
import { PrismaService } from 'src/prisma/prisma.service';

type MockFn = jest.Mock;

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: { payment: Record<string, MockFn> };

  beforeEach(async () => {
    prisma = {
      payment: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('payment()', () => {
    it('should call prisma.payment.findUnique and return the result', async () => {
      const mock = { id: 1, amount: 50 } as any;
      prisma.payment.findUnique.mockResolvedValue(mock);

      const result = await service.payment({ id: 1 });
      expect(prisma.payment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(mock);
    });

    it('should return null when findUnique returns null', async () => {
      prisma.payment.findUnique.mockResolvedValue(null);
      const result = await service.payment({ id: 999 });
      expect(result).toBeNull();
    });
  });

  describe('payments()', () => {
    it('should call prisma.payment.findMany with include and return the list', async () => {
      const list = [{ id: 1 }, { id: 2 }] as any[];
      prisma.payment.findMany.mockResolvedValue(list);

      const params = { skip: 5, take: 2, where: { status: 1 } };
      const result = await service.payments(params);

      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 2,
        cursor: undefined,
        where: { status: 1 },
        orderBy: undefined,
        include: { account: { select: { name: true } } },
      });
      expect(result).toBe(list);
    });
  });

  describe('createPayment()', () => {
    it('should map accountId to nested connect and call prisma.payment.create', async () => {
        const input = {
            accountId: 42,
            amount: 99.99,
            recipientName: 'Alice',
            recipientBank: 'Bank A',
            recipientBAN: '123',
            status: 1,
            notes: 'note',
        };
        const created = { id: 123, ...input } as any;
        prisma.payment.create.mockResolvedValue(created);

        await service.createPayment(input);

        expect(prisma.payment.create).toHaveBeenCalledWith(
            expect.objectContaining({
            data: expect.objectContaining({
                amount: 99.99,
                recipientName: 'Alice',
                recipientBank: 'Bank A',
                recipientBAN: '123',
                status: 1,
                notes: 'note',
                account: { connect: { id: 42 } },
            }),
            })
        );
      });

    it('should allow notes to be undefined', async () => {
      const input = {
        accountId: 7,
        amount: 10,
        recipientName: 'Bob',
        recipientBank: 'Bank B',
        recipientBAN: 456,
        status: 2,
      } as any;
      const created = { id: 456, ...input, notes: null } as any;
      prisma.payment.create.mockResolvedValue(created);

      const result = await service.createPayment(input);
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: {
          amount: 10,
          recipientName: 'Bob',
          recipientBank: 'Bank B',
          recipientBAN: 456,
          status: 2,
          notes: null,
          account: { connect: { id: 7 } },
        },
      });
      expect(result).toBe(created);
    });
  });

  describe('updatePayment()', () => {
    it('should call prisma.payment.update with given where & data', async () => {
      const params = {
        where: { id: 5 },
        data: { status: 3, notes: 'updated' } as any,
      };
      const updated = { id: 5, status: 3, notes: 'updated' } as any;
      prisma.payment.update.mockResolvedValue(updated);

      const result = await service.updatePayment(params);
      expect(prisma.payment.update).toHaveBeenCalledWith(params);
      expect(result).toBe(updated);
    });
  });

  describe('deletePayment()', () => {
    it('should call prisma.payment.delete and return the deleted record', async () => {
      const deleted = { id: 8 } as any;
      prisma.payment.delete.mockResolvedValue(deleted);

      const result = await service.deletePayment({ id: 8 });
      expect(prisma.payment.delete).toHaveBeenCalledWith({ where: { id: 8 } });
      expect(result).toBe(deleted);
    });
  });
});
