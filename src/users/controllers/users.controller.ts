import {
  Controller,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/user.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiOperation({
    summary: 'Email must be unique and the password minimum with 10 digits, at the last one upper case, lower case, digit and special character',
  })
  @Public()
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

}
