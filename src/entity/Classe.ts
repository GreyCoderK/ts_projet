import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Serie } from "./Serie";

@Entity()
export class Classe {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20
    })
    libelle: string

    @OneToMany(type => Serie, serie => serie.classe, {nullable:true})
    series: Serie[]
}