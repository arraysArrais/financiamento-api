import { Module } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { FinanciamentoController } from './financiamento.controller';
import { Financiamento } from './entities/financiamento.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  //imports: [SequelizeModule.forFeature([Financiamento])],
  controllers: [FinanciamentoController],
  providers: [FinanciamentoService]
})
export class FinanciamentoModule {}
