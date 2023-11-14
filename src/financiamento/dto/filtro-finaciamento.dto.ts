import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { DataType } from 'sequelize-typescript';
import { StatusFinanciamentoEnum } from '../enum/status_financiamento.enum';

export class FiltroFinanciamentoDto {

/*     @ApiProperty({
        example: 'GOL 1.6 MSI 8V 2022 FLEX',
        description: 'Item a ser financiado',
        required: false,
    })
    objeto: string; */

/*     @ApiProperty({
      enum: StatusFinanciamentoEnum,
      enumName: 'StatusFinanciamentoEnum',
      required: false,
    })
    status: StatusFinanciamentoEnum; */

    @ApiProperty({
        example: 1,
        description: 'Id do usuário responsável por realizar o pagamento',
        required: false,
    })
    id_pagador: number;

    @ApiProperty({
        example: 1,
        description: 'Id do usuário responsável pelo financiamento (o usuário no qual o nome está registrado no financiamento)',
        required: false,
    })
    id_responsavel: number;
}
