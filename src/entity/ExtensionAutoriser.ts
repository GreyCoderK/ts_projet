import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Document } from "./Document";

@Entity()
export class ExtensionAutoriser {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20
    })
    libelle: string

    @OneToMany(type => Document, document => document.extension, {nullable: true})
    documents: Document[]
}