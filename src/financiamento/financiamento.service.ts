import { Injectable } from '@nestjs/common';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';

@Injectable()
export class FinanciamentoService {
  create(createFinanciamentoDto: CreateFinanciamentoDto) {
    return 'This action adds a new financiamento';
  }

  findAll() {
    return `This action returns all financiamento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} financiamento`;
  }

  update(id: number, updateFinanciamentoDto: UpdateFinanciamentoDto) {
    return `This action updates a #${id} financiamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} financiamento`;
  }
}
