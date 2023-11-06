
import { AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
const bcrypt = require('bcrypt');
@Table({
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,

})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.INTEGER
    })
    id: number;

    @Column({allowNull: false, type: DataType.STRING})
    email: string;

    @Column({allowNull: false, type: DataType.STRING})
    firstname: string;

    @Column({allowNull: false, type: DataType.STRING})
    lastname: string;

    @Column({type:DataType.VIRTUAL(DataType.STRING)})
    get fullname(){
        return `${this.firstname} ${this.lastname}`
    }

    @BeforeCreate
    @BeforeUpdate
    static async hashPass(instance: User){
        const password = instance.getDataValue('password');
        instance.setDataValue('password', await bcrypt.hash(password, 10));
    }
    @Column({allowNull: false, type: DataType.STRING})
    password: string;
}