import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly bot: TelegramBot;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.error(
        'TELEGRAM_BOT_TOKEN is not set in environment variables',
      );
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.logger.log('Telegram bot initialized successfully');
  }

  onModuleInit(): void {
    this.bot.on('message', (message) => this.handleMessage(message));
  }

  private async handleMessage(message: TelegramBot.Message): Promise<void> {
    const { chat, text } = message;
    const chatId = chat.id;

    if (!text) {
      this.logger.warn(`Received a message without text in chat ${chatId}`);
      return;
    }

    if (text === '/start') {
      await this.handleStartCommand(chatId);
      await this.userService.startUser(message);
    }
  }

  private async handleStartCommand(chatId: number): Promise<void> {
    try {
      const url = this.getWebAppUrl(chatId);
      await this.bot.sendMessage(
        chatId,
        "Hello! Welcome to the bot. If you want to play Tic-Tac, press the 'Start game' button.",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Start game',
                  web_app: { url },
                },
              ],
            ],
          },
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to send start message to chat ${chatId}`,
        error.stack,
      );
    }
  }

  private getWebAppUrl(chatId: number): string {
    const baseUrl = this.configService.get<string>('TELEGRAM_GAME_URL');
    if (!baseUrl) {
      this.logger.error(
        'TELEGRAM_GAME_URL is not set in environment variables',
      );
      throw new Error('TELEGRAM_GAME_URL is required');
    }
    return `${baseUrl}?chat_id=${encodeURIComponent(chatId)}`;
  }
}
