import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateMovieDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsString()
  manager: string;

  @IsNotEmpty()
  @IsNumber()
  entranceCost: number;

  public: Boolean;

  @IsNumber()
  like: Number;

  @IsArray()
  userLikes: string[];

  @IsNotEmpty()
  date: Date;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) { }

