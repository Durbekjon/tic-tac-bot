import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BotService, UserService, UserRepository, PrismaService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class BotModule {}
