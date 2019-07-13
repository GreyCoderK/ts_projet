import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Serie } from "./Serie";
import { Document } from "./Document";

@Entity()
export class Classe {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20
    })
    libelle: string

    @OneToMany(type => Serie, serie => serie.classe, {
        nullable:true,
        cascade: true
    })
    series: Serie[]

    @OneToMany(type => Document, document => document.classe,{
        nullable:true,
        cascade: true
    })
    documents: Document[]
}