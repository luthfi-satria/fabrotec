import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { UserService } from './users.service';
import { CreateUsersDto } from './dto/users.dto';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { UserType } from 'src/hash/guard/user-type.decorator';

@Controller('api/')
@ResponseStatusCode()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('new_admin')
  async createNewAdmin(@Body() payload: CreateUsersDto) {
    return this.userService.createNewAdminUser(payload);
  }

  @Post('register')
  @UserType('admin', 'player')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async register(@Body() payload: CreateUsersDto) {
    return this.userService.createNewPlayer(payload);
  }

  @Post('scores')
  @UserType('admin', 'player')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async submitScores(@Body() payload, @Request() request) {
    console.log(request);
    return this.userService.submitScores(payload);
  }

  @Get('leaderboard')
  @UserType('admin', 'player')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async viewBoard() {
    return this.userService.viewBoard();
  }
}
