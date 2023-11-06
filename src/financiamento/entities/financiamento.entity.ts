
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { StatusFinanciamentoEnum } from '../enum/status_financiamento.enum';
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

    @Column({
        allowNull: false,
        type: DataType.ENUM({ values: Object.values(StatusFinanciamentoEnum) })
    })
    status: string;

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
}
