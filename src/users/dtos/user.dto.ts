import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ description: "the user' email" })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/, { message: 'The password length must be minimun of 10 digits and at the last one upper case, lower case, digit and special character (#?!@$%^&*-)' })
  @ApiProperty({ description: "the user' password", deprecated: true })
  readonly password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }
