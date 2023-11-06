import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { DataType } from 'sequelize-typescript';
import { StatusFinanciamentoEnum } from '../enum/status_financiamento.enum';

export class FiltroFinanciamentoDto {

    @ApiProperty({
        example: 'GOL 1.6 MSI 8V 2022 FLEX',
        description: 'Item a ser financiado'
    })
    objeto: string;

    @ApiProperty({
      enum: StatusFinanciamentoEnum,
      enumName: 'StatusFinanciamentoEnum',
    })
    status: StatusFinanciamentoEnum;

    @ApiProperty({
        example: 1,
        description: 'Id do usuário responsável por realizar o pagamento'
    })
    id_pagador: number;

    @ApiProperty({
        example: 1,
        description: 'Id do usuário responsável pelo financiamento (o usuário no qual o nome está registrado no financiamento)'
    })
    id_responsavel: number;
}
