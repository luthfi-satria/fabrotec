import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddScoreDto {
  @IsNotEmpty()
  @IsString()
  player_name: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}
