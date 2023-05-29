import { Body, Controller, Post } from '@nestjs/common';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { UserService } from './users.service';
import { CreateUsersDto } from './dto/users.dto';

@Controller('users/')
@ResponseStatusCode()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('new_admin')
  async createNewAdmin(@Body() payload: CreateUsersDto) {
    return this.userService.createNewAdminUser(payload);
  }
}
