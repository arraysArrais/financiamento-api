import { PartialType } from '@nestjs/swagger';
import { CreateFinanciamentoDto } from './create-financiamento.dto';

export class UpdateFinanciamentoDto extends PartialType(CreateFinanciamentoDto) {}
