import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('JWT-auth') //permite autenticação do controller inteiro na swagger ui
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 /*  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  } */

 /*  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  } */

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /* @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  } */
}
