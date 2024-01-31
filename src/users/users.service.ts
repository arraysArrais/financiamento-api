import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly sequelize: Sequelize,
  ){}

/*   create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  } */

  async findAll() {
    return await this.userModel.findAll({
      attributes:['id', 'firstname', 'lastname', 'fullname']
    });
  }

 /*  findOne(id: number) {
    return;
  } */

  async findByEmail(email: string): Promise<User>{
    return await this.userModel.findOne({
      where:{
        email,
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userModel.findByPk(1);
    user.password = '123456';
    user.save()

    console.log('new password!', user.password);
  }

  /* remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
