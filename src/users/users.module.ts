import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UsersDocument } from 'src/database/entities/users.entity';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { JwtService } from '@nestjs/jwt';
import { LeaderboardDocument } from 'src/database/entities/leaderboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersDocument, LeaderboardDocument])],
  exports: [UserService],
  providers: [UserService, ResponseService, MessageService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
