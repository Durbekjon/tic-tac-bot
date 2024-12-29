import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    return this.userService.findAll(page, limit);
  }

  @Get(':chatId')
  findByChatId(@Param('chatId') chatId: string) {
    return this.userService.findByChatId(chatId);
  }
}
