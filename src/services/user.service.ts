import { Injectable } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class UserService {
  private axios: AxiosInstance;
  constructor(
    private axiosService: AxiosService,
    private configService: ConfigService,
  ) {
    this.axios = axiosService.getAxiosInstance();
  }

  async startUser(message: TelegramBot.Message) {
    const user = {
      id: message.from.id.toString(),
      chatId: message.from.id.toString(),
      firstName: message.from.first_name,
      lastName: message.from.last_name || '',
      username: message.from.username || null,
      isPremium: false,
      languageCode: 'eng',
    };
   

    const foundUser = await this.findUserByChatId(message.from.id.toString());
    if (foundUser) {
      return foundUser;
    } else if (foundUser === null) {
      try {
        const response = await this.axios.post(
          `${this.configService.get('BACKEND_URL')}/api/user?app_key=${this.configService.get('APP_KEY')}`,
          user,
        );
        return response.data;
      } catch (error) {
      }
    }

  }

  private async findUserByChatId(chatId: string) {
    try {
      const response = await this.axios.get(
        `${this.configService.get('BACKEND_URL')}/api/user/${chatId}?app_key=${this.configService.get('APP_KEY')}`,
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }
}
