
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(email, pass) {
    const user = await this.usersService.findByEmail(email);

    if(!user){
      throw new UnauthorizedException();
    }
    
    let isValid = await bcrypt.compare(pass, user.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.lastname, /* email:user.email */ };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user:{
        id: user.id,
        email:user.email,
      }
    };
  }

  async verifyCredential(token: string) {
    try {
      let verification = await this.jwtService.verifyAsync(token);

      if (verification.username) {
        return { message: 'Token válido', id:verification.sub }
      }
    } catch (error) {
      console.error(error);
      return { message: 'Token inválido' }
    }
  }
}
