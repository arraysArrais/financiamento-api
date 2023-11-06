import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {

  constructor(
    private readonly sequelize: Sequelize,
  ) { }

  async getHello(): Promise<string> {
    //await this.sequelize.sync({force:true});
    return 'Olar!';
  }
}
