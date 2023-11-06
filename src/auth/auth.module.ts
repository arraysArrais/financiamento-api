
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { User } from 'src/users/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forFeature([
      User
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
  AuthService,
  {
    provide: 'APP_GUARD',
    useClass: AuthGuard
  }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
