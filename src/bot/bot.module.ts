import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/services/user.service';
import { AxiosService } from 'src/services/axios.service';

@Module({
  providers: [BotService, UserService, AxiosService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class BotModule {}
