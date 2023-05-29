import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UsersDocument } from 'src/database/entities/users.entity';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersDocument])],
  exports: [UserService],
  providers: [UserService, ResponseService, MessageService],
  controllers: [UsersController],
})
export class UsersModule {}
