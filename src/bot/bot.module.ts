import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/services/user.service';
import { AxiosService } from 'src/services/axios.service';
import { ChannelService } from 'src/services/channel.service';

@Module({
  providers: [BotService, UserService, AxiosService, ChannelService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class BotModule {}
