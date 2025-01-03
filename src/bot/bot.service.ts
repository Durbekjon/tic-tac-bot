import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { ChannelService } from 'src/services/channel.service';
import { UserService } from 'src/services/user.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly bot: TelegramBot;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
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
    this.bot.on('callback_query', (query) => this.handleCallbackQuery(query));
  }

  private async handleMessage(message: TelegramBot.Message): Promise<void> {
    const { chat, text } = message;
    const chatId = chat.id;

    if (!(await this.isUserSubscribed(chatId))) {
      this.promptSubscription(chatId);
      return;
    }

    if (text === '/start') {
      await this.initializeUser(message);
      await this.sendStartMessage(chatId);
    }
  }

  private async handleCallbackQuery(
    query: TelegramBot.CallbackQuery,
  ): Promise<void> {
    const chatId = query.message?.chat.id;

    if (query.data === 'check_subscription') {
      if (await this.isUserSubscribed(query.from.id)) {
        this.bot.sendMessage(chatId, "Obuna bo'lganingiz uchun rahmat!");
        this.sendStartMessage(chatId);
      } else {
        this.promptSubscription(chatId);
      }
    }
  }

  private async isUserSubscribed(userId: number): Promise<boolean> {
    try {
      const response = await this.bot.getChatMember('@byte_of_Durbek', userId);
      return ['member', 'administrator', 'creator'].includes(response.status);
    } catch (error) {
      this.logger.error(
        `Failed to check subscription for user ${userId}`,
        error.stack,
      );
      return false;
    }
  }

  private promptSubscription(chatId: number): void {
    this.bot.sendMessage(chatId, "Kanalga obuna bo'lishingiz kerak", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Kanalga o'tish", url: 'https://t.me/byte_of_Durbek' }],
          [{ text: "Obuna bo'ldim✅", callback_data: 'check_subscription' }],
        ],
      },
    });
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
