import { Injectable, Query, ValidationPipe } from '@nestjs/common';
import { CreateFinanciamentoDto } from './dto/create-financiamento.dto';
import { UpdateFinanciamentoDto } from './dto/update-financiamento.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Financiamento } from './entities/financiamento.entity';
import { Sequelize } from 'sequelize-typescript';
import { Parcela } from './entities/parcelamento.entity';
import { StatusParcelaEnum } from './enum/status_parcela.enum';
import { FiltroFinanciamentoDto } from './dto/filtro-finaciamento.dto';
import { UpdateParcelamentoDto } from './dto/update-parcelamento.dto';
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

  async create(createFinanciamentoDto: CreateFinanciamentoDto, img, user: any) {
    const t = await this.sequelize.transaction();
    createFinanciamentoDto.id_pagador = user.id
    createFinanciamentoDto.id_responsavel = user.id
    try {
      var newFinanciamento = await this.financiamentoModel.create({
        ...createFinanciamentoDto,
        img_objeto: img.buffer,
        img_objeto_tipo: img.mimetype,
      }, { transaction: t });
      var vencimento = dayjs(createFinanciamentoDto.vencimento_primeira_parcela);
      for (let i = 0; i < createFinanciamentoDto.qtd_parcelas; i++) {
        await this.parcelaModel.create({
          data_vencimento: vencimento.format('YYYY-MM-DD'),
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

  async findAll(queryParams: FiltroFinanciamentoDto) {
    return this.financiamentoModel.scope({ method: ['defaultFinanciamentoScope', queryParams] }).findAll();
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

  async update(id: number, updateFinanciamentoDto: UpdateFinanciamentoDto) {
    let financiamento = await this.financiamentoModel.findByPk(id);

    if(!financiamento){
      return {error: `Financiamento id ${id} não encontrado`}
    }

    const t = await this.sequelize.transaction();
    try{
      await financiamento.update({...updateFinanciamentoDto});
      await t.commit();

      return {message: `Financiamento id ${id} atualizado com sucesso`}
    }
    catch(error){
      await t.rollback();
      console.log(error)
    }

    
  }

  async remove(id: number) {
    let financiamento = await this.financiamentoModel.findByPk(id);

    if(!financiamento){
      return {error: `Financiamento id ${id} não encontrado`}
    }
    const t = await this.sequelize.transaction();
    try{
      await financiamento.destroy({
        transaction: t
      });
      await t.commit();

      return {message: `Financiamento id ${id} excluído com sucesso`}
    }
    catch(error){
      await t.rollback();
      console.log(error)
    }
    
  }

  async baixaFatura(id: number, img){
    let parcela = await this.parcelaModel.findByPk(id);
    const t = await this.sequelize.transaction();

    try{
      await parcela.update({
        img_comprovante: img.buffer,
        img_comprovante_tipo: img.mimetype,
        status: StatusParcelaEnum.PAGA
      });
      await t.commit();
      return parcela;
    }catch(error){
      await t.rollback();
      console.log(error)
    }
  }

  async getFatura(id: number){
    return this.parcelaModel.findByPk(id)
  }

  async findAllParcelas(id: number){
    return this.parcelaModel.findAll({
      attributes:['id', 'valor', 'data_vencimento', 'status'],
      where:{
        id_financiamento: id
      },
      order:[['data_vencimento', 'ASC']]
    });
  }

  async updateParcela(id: number, updateParcelaDto: UpdateParcelamentoDto) {
    let parcela = await this.parcelaModel.findByPk(id);

    if(!parcela){
      return {error: `Parcela id ${id} não encontrada`}
    }

    const t = await this.sequelize.transaction();
    try{
      await parcela.update({...updateParcelaDto});
      await t.commit();

      return {message: `Parcela id ${id} atualizada com sucesso`}
    }
    catch(error){
      await t.rollback();
      console.log(error)
    }

    
  }

  async getComprovante(id: number){
    let parcela = await this.parcelaModel.findByPk(id, {
      attributes:['img_comprovante', 'img_comprovante_tipo']
    });

    return {
      comprovante_string: parcela.img_comprovante.toString('base64'),
      comprovante_tipo: parcela.img_comprovante_tipo
    }
  }
}
