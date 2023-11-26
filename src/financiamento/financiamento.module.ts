import { Module } from '@nestjs/common';
import { FinanciamentoService } from './financiamento.service';
import { FinanciamentoController } from './financiamento.controller';
import { Financiamento } from './entities/financiamento.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Parcela } from './entities/parcelamento.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Financiamento, Parcela]), AuthModule],
  controllers: [FinanciamentoController],
  providers: [FinanciamentoService],
  exports: [FinanciamentoService],
})
export class FinanciamentoModule {}
