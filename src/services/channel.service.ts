import { Injectable } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChannelService {
  private axios: AxiosInstance;

  constructor(
    private axiosService: AxiosService,
    private configService: ConfigService,
  ) {
    this.axios = this.axiosService.getAxiosInstance();
  }

  async checkSubscription(
    channelUsername: string,
    botToken: string,
    userId: string,
  ): Promise<boolean> {
    try {
      console.log(channelUsername, botToken, userId);
      const response = await this.axios.get(
        `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`,
        {
          params: {
            chat_id: channelUsername,
            user_id: userId,
          },
        },
      );

      const status = response.data.result.status;
      return status === 'left' ? false : true;
    } catch (error) {
      console.error('Error checking subscription:', error.message);
      return false;
    }
  }
}
