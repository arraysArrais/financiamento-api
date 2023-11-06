
import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from 'sequelize-typescript';
const bcrypt = require('bcrypt');
@Table({
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,

})
export class User extends Model {

    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.INTEGER
    })
    id: number;

    @Column
    email: string;

    @Column
    firstname: string;

    @Column
    lastname: string;

    @BeforeCreate
    @BeforeUpdate
    static async hashPass(instance: User){
        const password = instance.getDataValue('password');
        instance.setDataValue('password', await bcrypt.hash(password, 10));
    }
    @Column
    password: string;
}