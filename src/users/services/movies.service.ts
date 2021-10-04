import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaginateModel
} from 'mongoose';

import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from '../dtos/movie.dto';



@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>
  ) { }

  findAll(user: string) {
    return this.movieModel.find({ user: user }).exec(); //.populate('user', "-password")
  }

  findAllPublic(pagination) {

    let page;
    let pageSize;

    if (!pagination.page) {
      page = 1
    } else {
      page = pagination.page;
    }

    if (!pagination.pageSize) {
      pageSize = 1
    } else {
      pageSize = pagination.pageSize;
    }


    let options = {
      sort: {
        date: -1,
      },
      limit: pageSize,
      page: page,
    };

    return false

  }

  findAllPublicLikedByMe(user) {
    return this.movieModel.find({ public: true, userLikes: user }).exec();
  }

  async findOne(id: string, user: string) {
    return this.movieModel.find({ _id: id, user: user });
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
