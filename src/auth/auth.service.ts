import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserType } from 'src/hash/guard/interface/user.interface';
import { HashService } from 'src/hash/hash.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

  async createAccessToken(username, password): Promise<string> {
    const user = await this.userService.findOne(username);
    const validate: boolean = await this.validatePassword(
      password,
      user.password,
    );
    if (!validate) {
      const errors: RMessage = {
        value: password,
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

    const payload = {
      sub: user.id,
      username: user.username,
      user_type: UserType.User,
      level: user.role_name,
    };

    return this.hashService.jwtSign(
      payload,
      process.env.AUTH_JWTEXPIRATIONTIME,
    );
  }

  async validateAccessToken(token: string): Promise<Record<string, any>> {
    return this.hashService.jwtPayload(token);
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
