import { Injectable, Query, ValidationPipe } from '@nestjs/common';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Financiamento } from './entities/financiamento.entity';
import { Sequelize } from 'sequelize-typescript';
import { Parcela } from './entities/parcelamento.entity';
const dayjs = require('dayjs')

@Injectable()
export class FinanciamentoService {
  constructor(
    @InjectModel(Financiamento)
    private financiamentoModel: typeof Financiamento,

    @InjectModel(Parcela)
    private parcelaModel: typeof Parcela,

    private readonly sequelize: Sequelize,
  ) { }

  async create(createFinanciamentoDto: CreateFinanciamentoDto) {
    const t = await this.sequelize.transaction();

    try {
      var newFinanciamento = await this.financiamentoModel.create({
        ...createFinanciamentoDto
      }, { transaction: t });
      var vencimento = dayjs(createFinanciamentoDto.vencimento_primeira_parcela);
      for (let i = 0; i < createFinanciamentoDto.qtd_parcelas; i++) {
        await this.parcelaModel.create({
          data_vencimento: vencimento.format('YYYY-MM-DD'), //primeiro vencimento tem que vir do dto, ou 30 dias após data atual, + cada parcela com o mesmo dia só que do mês seguinte
          valor: createFinanciamentoDto.valor_parcela, //valor tem que vir do dto
          id_financiamento: newFinanciamento.id
        }, { transaction: t });

        vencimento = vencimento.add(1, 'month');
      }

      await t.commit();
    }
    catch (error) {
      console.log(error)
      await t.rollback();
    }


    return await this.financiamentoModel.findByPk(newFinanciamento.id, {
      include: [
        {
          association: "parcelas",
          required: true
        }
      ]
    });
  }

  async findAll(queryParams) {
    return await this.financiamentoModel.findAll({
      include: [
        {
          association: 'parcelas',
          required: true,
        },
      ],
      order: [
        ['parcelas', 'data_vencimento', 'ASC'],
      ],
      where: {
        ...queryParams
      }
    });
  }

  async findOne(id: number) {
    return await this.financiamentoModel.findByPk(id, {
      include: [
        {
          association: 'parcelas',
          required: true
        }
      ],
    });
  }

  update(id: number, updateFinanciamentoDto: UpdateFinanciamentoDto) {
    return `This action updates a #${id} financiamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} financiamento`;
  }
}
