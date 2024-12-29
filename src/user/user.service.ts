import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(page: number = 0, limit: number = 10) {
    const skip = page * limit;
    const users = await this.userRepository.findAll(skip, limit);
    const count = await this.userRepository.countOfUsers();
    return { users, total_users: count };
  }

  findByChatId(chatId: string) {
    return this.userRepository.findByChatId(chatId);
  }

  async startUser(body: any) {
    const userBody: Prisma.UserCreateInput = {
      chatId: body.chat.id.toString(),
      firstName: body.from.first_name,
      lastName: body.from.last_name || '',
      username: body.from.username || '',
      languageCode: body.from.language_code,
      isPremium: body.from.is_premium || false,
    };

    const existUser = await this.findByChatId(userBody.chatId);
    if (existUser) return existUser;
    return await this.userRepository.create(userBody);
  }
}
