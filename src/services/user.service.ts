import { Injectable } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private axios: AxiosInstance;
  constructor(
    private axiosService: AxiosService,
    private configService: ConfigService,
  ) {
    this.axios = axiosService.getAxiosInstance();
  }

  async startUser(message: any) {
    const user = {
      id: message.from.id.toString(),
      chatId: message.from.id.toString(),
      firstName: message.from.first_name,
      lastName: message.from.last_name || '',
      username: message.from.username || null,
      isPremium: message.from.is_premium || false,
      languageCode: 'eng',
    };

    const response = await this.findUserByChatId(message.from.id.toString());
    if (response.user !== null) {
      return response.user;
    } else if (response.user === null) {
      try {
        const response = await this.axios.post(
          `${this.configService.get('BACKEND_URL')}/api/user?app_key=${this.configService.get('APP_KEY')}`,
          user,
        );
        return response.data;
      } catch (error) {}
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
