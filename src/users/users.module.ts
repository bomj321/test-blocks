import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User, UserSchema } from './entities/user.entity';
import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';
import { Movie, MovieSchema } from './entities/movie.entity';
@Module({
  imports: [
    MongooseModule.forFeature([

      {
        name: User.name,
        schema: UserSchema,
      },

      {
        name: Movie.name,
        schema: MovieSchema,
      },
    ]),
  ],
  controllers: [MoviesController, UsersController],
  providers: [UsersService, MoviesService],
  exports: [UsersService]
})
export class UsersModule { }
