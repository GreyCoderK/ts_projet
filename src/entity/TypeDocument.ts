import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Document } from "./Document";

@Entity()
export class TypeDocument {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        unique: true
    })
    libelle: string

    @OneToMany(type => Document, document => document.typeDocument,{
        nullable: true,
        cascade: true
    })
    documents: Document[]
}