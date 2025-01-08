import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserService } from 'src/services/user.service';

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
    // this.bot.on('callback_query', (query) => this.handleCallbackQuery(query));
  }

  private async handleMessage(message: TelegramBot.Message): Promise<void> {
    const { chat, text } = message;
    const chatId = chat.id;

    if (text === '/start') {
      await this.initializeUser(message);
      await this.sendStartMessage(chatId);
    }

    if (text === '/users') {
      const response = await this.userService.findUsers();

      const message = `📊 <b>Rating:</b>\n${response
        .map((user, index) => {
          const userProfileLink = user.chatId
            ? `tg://user?id=${user.chatId}`
            : ''; // Chat ID mavjud bo'lmagan userlar uchun fallback
          return `<b>${index + 1}.</b> ${
            userProfileLink
              ? `<a href="${userProfileLink}">${user.firstName}${
                  user?.lastName ? ` ${user.lastName}` : ''
                }</a>`
              : `${user.firstName}${user?.lastName ? ` ${user.lastName}` : ''}`
          } - ${user.gamesPlayed} games played`;
        })
        .join('\n')}`;

      this.bot.sendMessage('6092896396', message, {
        parse_mode: 'HTML',
      });
    }
  }

  private async initializeUser(message: TelegramBot.Message): Promise<void> {
    try {
      await this.userService.startUser(message);
    } catch (error) {
      this.logger.error('Failed to initialize user', error.stack);
    }
  }

  private async sendStartMessage(chatId: number): Promise<void> {
    try {
      const webAppUrl = this.getWebAppUrl(chatId);
      await this.bot.sendMessage(
        chatId,
        "Hello! Welcome to the bot. If you want to play Tic-Tac, press the 'Start game' button.",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Start game', web_app: { url: webAppUrl } }],
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
