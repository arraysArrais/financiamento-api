import { Module } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { FinanciamentoController } from './financiamento.controller';
import { Financiamento } from './entities/financiamento.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Parcela } from './entities/parcelamento.entity';

@Module({
  imports: [SequelizeModule.forFeature([Financiamento, Parcela])],
  controllers: [FinanciamentoController],
  providers: [FinanciamentoService],
  exports: [FinanciamentoService]
})
export class FinanciamentoModule {}
