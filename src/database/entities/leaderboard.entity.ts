import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersDocument } from './users.entity';

@Entity({ name: 'leaderboard' })
export class LeaderboardDocument {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => UsersDocument, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_profile: UsersDocument;

  @Column({
    type: 'int4',
    nullable: false,
    default: 0,
  })
  score?: number;

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

  constructor(init?: Partial<LeaderboardDocument>) {
    Object.assign(this, init);
  }
}
