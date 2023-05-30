import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { AuthJwtGuard } from './auth.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Post('login')
  async login(
    @Body()
    data: Record<string, any>,
  ): Promise<any> {
    const dailytoken: string = await this.authService.createAccessToken(
      data.username,
      data.password,
    );
    if (!dailytoken) {
      const errors: RMessage = {
        value: '',
        property: 'token',
        constraint: ['Invalid token'],
      };
      return this.responseService.error(
        HttpStatus.UNAUTHORIZED,
        errors,
        'UNAUTHORIZED',
      );
    }

    return this.responseService.success(true, 'Token successfully generated!', {
      token: dailytoken,
    });
  }

  @AuthJwtGuard()
  @Get('validate-token')
  async validateToken(@Headers('Authorization') token: string): Promise<any> {
    token = token.replace('Bearer ', '');
    const payload: Record<string, any> =
      await this.authService.validateAccessToken(token);
    if (!payload) {
      const errors: RMessage = {
        value: token,
        property: 'token',
        constraint: ['Invalid token'],
      };
      return this.responseService.error(
        HttpStatus.UNAUTHORIZED,
        errors,
        'UNAUTHORIZED',
      );
    }
    return this.responseService.success(true, 'token is valid', {
      payload: payload,
    });
  }
}
