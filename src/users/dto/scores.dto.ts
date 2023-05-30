import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddScoreDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}
