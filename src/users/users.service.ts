import {
  BadRequestException,
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
import { LeaderboardDocument } from 'src/database/entities/leaderboard.entity';
import { AddScoreDto } from './dto/scores.dto';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersDocument)
    private readonly usersRepo: Repository<UsersDocument>,
    @InjectRepository(LeaderboardDocument)
    private readonly leaderboardRepo: Repository<LeaderboardDocument>,
    private readonly responseService: ResponseService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async findOne(username: string) {
    return await this.usersRepo.findOne({ where: { username: username } });
  }

  async createNewAdminUser(data: CreateUsersDto) {
    try {
      console.log(data);
      const isExists = await this.usersRepo
        .createQueryBuilder()
        .where('email = :email', { email: data.email })
        .getOne();
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
      console.log(isPhoneExists);
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

  async createNewPlayer(data: CreateUsersDto) {
    try {
      console.log(data);
      const isExists = await this.usersRepo
        .createQueryBuilder()
        .where('email = :email', { email: data.email })
        .getOne();
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
      console.log(isPhoneExists);
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
      const newAdmin = new UsersDocument({
        ...data,
        role_name: UserRole.Player,
        password: await this.generateHashPassword(data.password),
        token_reset_password: token,
      });

      const result: Record<string, any> = await this.usersRepo
        .save(newAdmin)
        .catch((e) => {
          Logger.error(e.message, '', 'Registering player');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success Registering Users!',
        result,
      );
    } catch (err) {
      Logger.error(err.message, 'Create new Player');
      throw err;
    }
  }

  async generateHashPassword(password: string): Promise<string> {
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    const salt = genSaltSync(defaultSalt);

    return hash(password, salt);
  }

  async submitScores(payload: AddScoreDto) {
    try {
      return await this.leaderboardRepo.save(payload);
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: '',
            constraint: ['Failed to save the score', error.message],
          },
          'Bad Request',
        ),
      );
    }
  }

  async viewBoard() {
    try {
      console.log('View boards');
      const result = await this.leaderboardRepo
        .createQueryBuilder('board')
        .select(['user.id', 'user.username', 'SUM(board.score) AS scores'])
        .leftJoin('board.user_profile', 'user')
        .groupBy('user.id')
        .addGroupBy('user.username')
        .orderBy('SUM(board.score)', 'DESC')
        .limit(10)
        .getMany();

      return this.responseService.success(
        true,
        'Displaying leaderboard',
        result,
      );
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
