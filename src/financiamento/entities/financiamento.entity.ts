
import { AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { StatusFinanciamentoEnum } from '../enum/status_financiamento.enum';
import { Parcela } from './parcelamento.entity';
import { StatusParcelaEnum } from '../enum/status_parcela.enum';
import { defaultScope } from '../scopes/financiamentoDefault.scope';
@Scopes(() => ({
    defaultFinanciamentoScope:defaultScope
  }))
@Table({
    tableName: 'financiamento',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
})
export class Financiamento extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    id: number;

    @Column({ allowNull: false, type: DataType.STRING })
    objeto: string;

    /* @Default(StatusFinanciamentoEnum.PENDENTE)
    @Column({
        allowNull: false,
        type: DataType.ENUM({ values: Object.values(StatusFinanciamentoEnum) }),
        
    })
    status: string;

    
 */
    @Column({ type: DataType.VIRTUAL(DataType.STRING) })
    get status() {
        const today = new Date()
        const em_atraso = this.parcelas?.filter((parcela) => {
        let data_vencimento = new Date(parcela.data_vencimento)
            return (data_vencimento < today && !(parcela.status == StatusParcelaEnum.PAGA))
        });
        return em_atraso.length > 0 ? StatusFinanciamentoEnum.EM_ATRASO : StatusFinanciamentoEnum.EM_DIA
    }

    //FK
    @ForeignKey(() => User)
    @Column({ allowNull: false, type: DataType.INTEGER })
    id_pagador: number;

    @ForeignKey(() => User)
    @Column({ allowNull: false, type: DataType.INTEGER })
    id_responsavel: number;

    //relacionamentos
    @BelongsTo(() => User, {
        foreignKey: 'id_pagador',
        targetKey: 'id'
    })
    declare readonly pagador: User

    @BelongsTo(() => User, {
        foreignKey: 'id_responsavel',
        targetKey: 'id'
    })
    declare readonly responsavel: User

    @HasMany(() => Parcela)
    declare readonly parcelas: Parcela[]
}
