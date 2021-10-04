import {
  Controller,
  Req,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query
} from '@nestjs/common';
import { Request } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { MoviesService } from '../services/movies.service';
import { CreateMovieDto, UpdateMovieDto, PaginationParams } from '../dtos/movie.dto';
import { PayloadToken } from 'src/auth/models/token.model';

@UseGuards(JwtAuthGuard)
@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) { }

  @Get()
  findAll(@Req() req: Request, @Query() { page, pageSize }: PaginationParams) {
    const user = req.user as PayloadToken;
    return this.moviesService.findAll(user.sub, page, pageSize);
  }

  @Public()
  @Get('/public')
  findAllPublic(@Query() { page, pageSize }: PaginationParams) {

    return this.moviesService.findAllPublic(page, pageSize);
  }

  @Get('/public/liked-by-me')
  findAllPublicLikedByMe(@Req() req: Request, @Query() { page, pageSize }: PaginationParams) {
    const user = req.user as PayloadToken;
    return this.moviesService.findAllPublicLikedByMe(user.sub, page, pageSize);
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as PayloadToken;
    return this.moviesService.findOne(id, user.sub);
  }

  @Post()
  create(@Req() req: Request, @Body() payload: CreateMovieDto) {
    const user = req.user as PayloadToken;
    return this.moviesService.create(payload, user.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateMovieDto) {
    return this.moviesService.update(id, payload);
  }

  @Put('like/:id')
  updateLike(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as PayloadToken;

    return this.moviesService.updateLike(id, user.sub);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as PayloadToken;
    return this.moviesService.remove(id, user.sub);
  }
}
