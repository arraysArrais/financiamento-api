import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Headers, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign_in.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @InjectModel(User)
    private userModel: typeof User
    ) { }

  @Public() //endpoint para acesso público
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiBearerAuth('JWT-auth') //permite autenticação do serviço na swagger ui
  @Post('verify')
  async verify(@Headers() headers, @Response() res) {
    const [bearer, token] = headers.authorization.split(' ')
    try{
      let credentialCheck = await this.authService.verifyCredential(token)

      if (credentialCheck.message == 'Token válido') {
        let user = await this.userModel.findByPk(credentialCheck.id);
        res.status(200).send({message:'Autorizado', user:{
          id: user.id,
          fullname: user.fullname,
          email: user.email,
        }})
      }
      else {
        res.status(401).send({message:'Não autorizado'})
      }
    }
    catch(error){
      console.error(error)
    }

  }
}