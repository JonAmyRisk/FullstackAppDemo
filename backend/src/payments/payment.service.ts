import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async payment(
    userWhereUniqueInput: Prisma.PaymentWhereUniqueInput,
  ): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async payments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PaymentWhereUniqueInput;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput;
  }): Promise<Payment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.payment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
      account: {
        select: { name: true }
      }
    },
    });
  }

  async createPayment(data: {
  accountId: number;
  amount: number;
  recipientName: string;
  recipientBank: string;
  recipientBAN: number;
  status: number;
  notes?: string;
  }): Promise<Payment> {
    const { accountId, notes, ...rest } = data;
    return this.prisma.payment.create({
      data: {
        ...rest,
        notes: notes ?? null,
        account: { connect: { id: accountId } },
      },
    });
  }

  async updatePayment(params: {
    where: Prisma.PaymentWhereUniqueInput;
    data: Prisma.PaymentUpdateInput;
  }): Promise<Payment> {
    const { where, data } = params;
    return this.prisma.payment.update({
      data,
      where,
    });
  }

  async deletePayment(where: Prisma.PaymentWhereUniqueInput): Promise<Payment> {
    return this.prisma.payment.delete({
      where,
    });
  }
}