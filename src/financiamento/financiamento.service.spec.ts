import { Test, TestingModule } from '@nestjs/testing';
import { FinanciamentoService } from './financiamento.service';

describe('FinanciamentoService', () => {
  let service: FinanciamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanciamentoService],
    }).compile();

    service = module.get<FinanciamentoService>(FinanciamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
