import { Test, TestingModule } from '@nestjs/testing';
import { FinanciamentoController } from './financiamento.controller';
import { FinanciamentoService } from './financiamento.service';

describe('FinanciamentoController', () => {
  let controller: FinanciamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanciamentoController],
      providers: [FinanciamentoService],
    }).compile();

    controller = module.get<FinanciamentoController>(FinanciamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
