import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  /*todo: 
    1. write user caching logic
    2. write userData typing
  
  */
  public async saveUser(userData: any): Promise<void> {
    try {
      await this.userModel.create(userData);
    } catch (error) {
      console.log('Error saving user:', error);
    }
  }

  public async findByTgId(tgId: number) {
    const foundUser = await this.userModel.findOne({ tgId }).lean();
    return foundUser;
  }
}
