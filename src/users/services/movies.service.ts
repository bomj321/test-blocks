import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from '../dtos/movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: PaginateModel<Movie>
  ) { }

  findAll(user: string, page = 1, pageSize = 5) {
    return this.movieModel.paginate({ user: user }, {
      page: !page ? 1 : page,
      limit: !pageSize ? 5 : pageSize
    });
  }

  findAllPublic(page = 1, pageSize = 5) {
    return this.movieModel.paginate({ public: true }, {
      page: !page ? 1 : page,
      limit: !pageSize ? 5 : pageSize
    });

  }

  findAllPublicLikedByMe(user, page = 1, pageSize = 5) {
    return this.movieModel.paginate({ public: true, userLikes: user }, {
      page: !page ? 1 : page,
      limit: !pageSize ? 5 : pageSize
    });

  }

  async findOne(id: string, user: string) {
    return this.movieModel.find({ _id: id, user: user }).populate('user', "-password");
  }

  create(data: CreateMovieDto, user: string) {
    const newModel = new this.movieModel({ ...data, user });
    return newModel.save();
  }

  update(id: string, changes: UpdateMovieDto) {
    return this.movieModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
  }

  async updateLike(id: string, user: string) {

    const movieSaved = await this.movieModel.findById(id);

    if (movieSaved) {
      if (movieSaved.userLikes && movieSaved.userLikes.length > 0) {
        const userIncluded = movieSaved.userLikes.includes(user);
        if (userIncluded) {
          movieSaved.like = movieSaved.like === 0 ? 0 : Number(movieSaved.like) - 1;
          movieSaved.userLikes = movieSaved.userLikes.filter(item => item !== user);

        } else {
          movieSaved.like = Number(movieSaved.like) + 1;
          let movieUserLikesArray = [...movieSaved.userLikes, user];
          movieSaved.userLikes = movieUserLikesArray;

        }
      } else {
        movieSaved.like = Number(movieSaved.like) + 1;
        let movieUserLikesArray = [user];
        movieSaved.userLikes = movieUserLikesArray;
      }

      return this.movieModel
        .findByIdAndUpdate(id, { $set: movieSaved }, { new: true })
        .exec();

    } else {
      throw new NotFoundException(`Movie #${id} not found`);
    }
  }



  async remove(id: string, user: string) {

    const movieSaved = await this.movieModel.find({ _id: id, user: user })

    if (movieSaved && movieSaved.length > 0) {
      return this.movieModel.findByIdAndDelete(id);

    } else {
      throw new NotFoundException(`Movie #${id} not found`);
    }

  }
}
