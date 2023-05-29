import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { UserService } from './users.service';
import { CreateUsersDto } from './dto/users.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users/')
@ResponseStatusCode()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('new_admin')
  async createNewAdmin(@Body() payload: CreateUsersDto) {
    return this.userService.createNewAdminUser(payload);
  }

  @Post('scores')
  @UseGuards(AuthGuard)
  async submitScores(@Body() payload) {
    return this.userService.submitScores(payload);
  }

  @Get('leaderboard')
  // @UseGuards(AuthGuard)
  async viewBoard() {
    return this.userService.viewBoard();
  }
}
