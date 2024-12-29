import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findAll(skip: number = 0, take: number = 10) {
    return this.prisma.user.findMany({
      skip,
      take,
    });
  }

  countOfUsers() {
    return this.prisma.user.count();
  }

  findByChatId(chatId: string) {
    return this.prisma.user.findUnique({ where: { chatId } });
  }
}
