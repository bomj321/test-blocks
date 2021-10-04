import { Injectable, BadRequestException } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/user.dto';
import { MoviesService } from './movies.service';


@Injectable()
export class UsersService {
  constructor(
    private moviesService: MoviesService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async findOne(id: string) {
    return this.userModel.findById(id);
  }


  async create(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    const hashPassword = await bcrypt.hash(newModel.password, 10);
    newModel.password = hashPassword;

    try {
      await newModel.save();
      let message = { message: 'User created' }
      return message;
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new BadRequestException("This email already exist, please try again");
      }
    }

  }

  async createMoviesWithUser(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    const hashPassword = await bcrypt.hash(newModel.password, 10);
    newModel.password = hashPassword;
    const userExist = await this.findByEmail(data.email);
    if (userExist) {
      await this.remove(userExist._id);
      await this.moviesService.removePublicElementsByUser(userExist._id)
    }

    try {
      const userSaved = await newModel.save();
      if (userSaved && userSaved._id) {
        for (let index = 0; index < 20; index++) {

          await this.moviesService.create({
            "name": `Avengers ${index}`,
            "description": "Description",
            "manager": userSaved.email,
            "entranceCost": 1000,
            "date": "2016-09-18T00:00:00.000Z",
            "like": 0,
            "public": true,
            "userLikes": []
          }, userSaved._id);

        }
      }

    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new BadRequestException("This email already exist, please try again");
      }
    }

  }


  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }


}
