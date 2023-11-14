import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FiltroFinanciamentoDto } from './dto/filtro-finaciamento.dto';
import { Response } from 'express';

@ApiTags('Financiamento')
@Controller('financiamento')
@ApiBearerAuth('JWT-auth') //permite autenticação do controller inteiro na swagger ui
export class FinanciamentoController {
  constructor(private readonly financiamentoService: FinanciamentoService) { }

  @Post()
  create(@Body() createFinanciamentoDto: CreateFinanciamentoDto) {
    return this.financiamentoService.create(createFinanciamentoDto);
  }

  @Get()
  async findAll(@Query(/* new ValidationPipe() */) query: FiltroFinanciamentoDto, @Res() res: Response) {
    try {
      let financiamentos = await this.financiamentoService.findAll(query);
      if (financiamentos.length == 0) {
        res.status(404).send({error: 'Registro de financiamento não encontrado'})
      }
      else
        res.status(200).send(financiamentos);

    } catch (error) {
      console.log(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financiamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinanciamentoDto: UpdateFinanciamentoDto) {
    return this.financiamentoService.update(+id, updateFinanciamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financiamentoService.remove(+id);
  }
}
