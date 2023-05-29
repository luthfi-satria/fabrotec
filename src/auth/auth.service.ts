import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private messageService: MessageService,
    private responseService: ResponseService,
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findOne(username);
    const validate: boolean = await this.validatePassword(pass, user.password);
    if (!validate) {
      const errors: RMessage = {
        value: pass,
        property: 'password',
        constraint: ['Invalid user accounts'],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }

    console.log('create token');
    const payload = {
      sub: user.id,
      username: user.username,
      user_type: user.role_name,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validatePassword(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.bcryptComparePassword(passwordString, passwordHash);
  }

  async bcryptComparePassword(
    passwordString: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return compare(passwordString, passwordHashed);
  }
}
