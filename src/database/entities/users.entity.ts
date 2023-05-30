import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeaderboardDocument } from './leaderboard.entity';

export enum UserStatus {
  Waiting_for_approval = 'WAITING_FOR_APPROVAL',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Rejected = 'REJECTED',
}

export enum UserRole {
  Player = 'player',
  Admin = 'admin',
}

@Entity({ name: 'users' })
export class UsersDocument {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: false })
  name?: string;

  @Column({ type: 'varchar', nullable: false })
  username?: string;

  @Column({ type: 'varchar', nullable: false })
  email?: string;

  @Column({ type: 'varchar', nullable: false })
  phone?: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  token_reset_password: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at?: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at?: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status?: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.Player,
  })
  role_name: UserRole;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => LeaderboardDocument, (userscore) => userscore.user_id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  scores: LeaderboardDocument[];

  constructor(init?: Partial<UsersDocument>) {
    Object.assign(this, init);
  }
}
