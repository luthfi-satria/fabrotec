import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigService,
    UsersModule,
    JwtModule.register({
      secret: `${process.env.AUTH_JWTSECRETKEY}`,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, ResponseService, MessageService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
