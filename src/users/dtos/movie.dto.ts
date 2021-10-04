import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/swagger';

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

export class UpdateMovieDto extends PartialType(
  OmitType(CreateMovieDto, ['userLikes']),  // 👈 implement OmitType
) { }


export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

