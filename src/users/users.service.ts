import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, UsersDocument } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/users.dto';
import { ResponseService } from 'src/response/response.service';
import { genSaltSync, hash } from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersDocument)
    private readonly usersRepo: Repository<UsersDocument>,
    private readonly responseService: ResponseService,
  ) {}

  async findOne(username: string) {
    return await this.usersRepo.findOne({ where: { username: username } });
  }

  async createNewAdminUser(data: CreateUsersDto) {
    const isExists = await this.usersRepo.findOne({
      where: { email: data.email },
    });
    console.log(isExists);
    if (isExists) {
      throw new ConflictException(
        this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: data.email,
            property: 'email',
            constraint: ['email already registered!'],
          },
          'User Already Exists',
        ),
      );
    }

    const isPhoneExists = await this.usersRepo.findOne({
      where: { phone: data.phone },
    });
    if (isPhoneExists) {
      throw new ConflictException(
        this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: data.phone,
            property: 'phone',
            constraint: ['Phone number already registered!'],
          },
          'User Already Exists',
        ),
      );
    }

    const token = randomUUID();
    try {
      const newAdmin = new UsersDocument({
        ...data,
        role_name: UserRole.Admin,
        password: await this.generateHashPassword(data.password),
        token_reset_password: token,
      });

      const result: Record<string, any> = await this.usersRepo
        .save(newAdmin)
        .catch((e) => {
          Logger.error(e.message, '', 'Create Admin User');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success Create new admin!',
        result,
      );
    } catch (err) {
      Logger.error(err.message, 'Create new Admin');
      throw err;
    }
  }

  async generateHashPassword(password: string): Promise<string> {
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    const salt = genSaltSync(defaultSalt);

    return hash(password, salt);
  }
}
