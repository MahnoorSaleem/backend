import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';

interface UserT {
  _id: string;
  name: string;
  email: string;
  password?: string;
}

@Injectable()
export class UserService {
  logger: Logger;
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>,
  @Inject(forwardRef(() => AuthService))
  private AuthService: AuthService
) {
    this.logger = new Logger(UserService.name);
  }

  

  async findOne(query: Partial<UserT>): Promise<User | null> {
    this.logger.log('Finding user by Email', query);
    try {
        const user = await this.userModel.findOne(query).select('+password').exec();;
        return user;
    } catch (error) {
        this.logger.error('Error finding user:', error.message);
        throw new HttpException('Failed to find user.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(user: Partial<UserT>): Promise<any> {
    this.logger.log('Creating user.');
      try {
        const hashedPassword = await this.AuthService.getHashedPassword(user.password);
        user.password = hashedPassword;
        this.logger.debug('Creating user details', user);
        const newUser = new this.userModel(user);
        const saveduserInfo =  await newUser.save();
        if (saveduserInfo) {
          const { name, email, _id } = saveduserInfo;
          return { name, email, _id };
        }
        return saveduserInfo;

      } catch (error) {
          this.logger.error('Error creating user:', error.message);
          if (error.code === 11000) {
            throw new HttpException('User already exists.', HttpStatus.CONFLICT);
          }
          throw new HttpException('Failed to create user.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
}