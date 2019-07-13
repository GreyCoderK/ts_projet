import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./User";

@Entity()
export class TypeUser {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20,
        unique: true
    })
    libelle: string

    @OneToMany(type => User, user => user.typeUser, {
        nullable: true,
        cascade: true
    })
    users: User[]
}