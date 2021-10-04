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

import { ApiTags, ApiOperation } from '@nestjs/swagger';
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

  @ApiOperation({
    summary: 'Get all your movies'
  })
  @Get()
  findAll(@Req() req: Request, @Query() { page, pageSize }: PaginationParams) {
    const user = req.user as PayloadToken;
    return this.moviesService.findAll(user.sub, page, pageSize);
  }

  @ApiOperation({
    summary: 'Get all public movies'
  })
  @Public()
  @Get('/public')
  findAllPublic(@Query() { page, pageSize }: PaginationParams) {
    return this.moviesService.findAllPublic(page, pageSize);
  }

  @ApiOperation({
    summary: 'Get all public movies liked by me'
  })
  @Get('/public/liked-by-me')
  findAllPublicLikedByMe(@Req() req: Request, @Query() { page, pageSize }: PaginationParams) {
    const user = req.user as PayloadToken;
    return this.moviesService.findAllPublicLikedByMe(user.sub, page, pageSize);
  }

  @ApiOperation({
    summary: 'Get one movie created for you'
  })
  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as PayloadToken;
    return this.moviesService.findOne(id, user.sub);
  }

  @ApiOperation({ summary: 'Create a movie' })
  @Post()
  create(@Req() req: Request, @Body() payload: CreateMovieDto) {
    const user = req.user as PayloadToken;
    return this.moviesService.create(payload, user.sub);
  }


  @Public()
  @Post()
  createPrefillPublicElements(@Req() req: Request, @Body() payload: CreateMovieDto) {
    const user = req.user as PayloadToken;
    return this.moviesService.create(payload, user.sub);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a movie'
  })
  update(@Param('id') id: string, @Body() payload: UpdateMovieDto) {
    return this.moviesService.update(id, payload);
  }

  @Put('like/:id')
  @ApiOperation({
    summary: 'Like or dislike a movie'
  })
  updateLike(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as PayloadToken;

    return this.moviesService.updateLike(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a movie'
  })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as PayloadToken;
    return this.moviesService.remove(id, user.sub);
  }
}
