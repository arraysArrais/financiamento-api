
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Financiamento } from './financiamento.entity';
import { StatusParcelaEnum } from '../enum/status_parcela.enum';

@Table({
    tableName: 'parcela',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
})

export class Parcela extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    id: number;

    @Column({
        allowNull: false,
        type: DataType.DECIMAL
    })
    valor: number;

    @Column({
        allowNull: false,
        type: DataType.DATEONLY
    })
    data_vencimento: Date;

    @Column({
        allowNull: false,
        type: DataType.ENUM({ values: Object.values(StatusParcelaEnum) }),
        defaultValue: StatusParcelaEnum.PENDENTE
    })
    status: StatusParcelaEnum

    //FK
    @ForeignKey(() => Financiamento)
    @Column({ allowNull: false, type: DataType.INTEGER })
    id_financiamento: number;

    //relacionamentos
    @BelongsTo(() => Financiamento, {
        foreignKey: 'id_financiamento',
        targetKey: 'id'
    })
    declare readonly financiamento: Financiamento
}
