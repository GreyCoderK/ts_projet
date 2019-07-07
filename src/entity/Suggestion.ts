import { ManyToOne ,Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Document } from "./Document";

@Entity()
export class Suggestion {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    libelle: string

    @Column("text")
    description: string

    @ManyToOne(type => Document, document => document.suggestions, {nullable: true})
    document:Document
}
