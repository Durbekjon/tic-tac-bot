import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BotModule, PrismaModule, UserModule],
})
export class AppModule {}
