import { Controller, Post, Logger, ConflictException, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger(UserController.name);
  }

  @Post('create')
  async create(@Body() req: CreateUserDto) {
    const newUser = req;
    try {
      const query = { email: newUser.email };
      const isUser = await this.userService.findOne(query);
      if (isUser) throw new ConflictException('User Already Exist');
      const user = await this.userService.create(newUser);
      return user;
    } catch (err) {
      this.logger.error('Something went wrong in signup:', err);
      throw err;
    }
  }
}