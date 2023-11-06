import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Financiamento')
@Controller('financiamento')
export class FinanciamentoController {
  constructor(private readonly financiamentoService: FinanciamentoService) {}

  @Post()
  create(@Body() createFinanciamentoDto: CreateFinanciamentoDto) {
    return this.financiamentoService.create(createFinanciamentoDto);
  }

  @Get()
  findAll() {
    return this.financiamentoService.findAll();
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
