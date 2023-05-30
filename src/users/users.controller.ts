import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { UserService } from './users.service';
import { CreateUsersDto } from './dto/users.dto';

@Controller('api/')
@ResponseStatusCode()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('new_admin')
  async createNewAdmin(@Body() payload: CreateUsersDto) {
    return this.userService.createNewAdminUser(payload);
  }

  @Post('register')
  async register(@Body() payload: CreateUsersDto) {
    return this.userService.createNewPlayer(payload);
  }

  @Post('scores')
  async submitScores(@Body() payload) {
    return this.userService.submitScores(payload);
  }

  @Get('leaderboard')
  async viewBoard() {
    return this.userService.viewBoard();
  }
}
