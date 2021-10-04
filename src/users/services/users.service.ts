import { Injectable, BadRequestException } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  findAll() {
    return this.userModel.find().exec();
  }

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

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: string, changes: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
