import { ManyToOne ,Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Document } from "./Document";
import { User } from "./User";
import { Actualite } from "./Actualite";

@Entity()
export class Commentaire {

    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    libelle: string

    @ManyToOne(type => User, user => user.commentaires, {nullable:true})
    user:User

    @ManyToOne(type => Document, document => document.commentaires, {nullable:true})
    document:Document

    @ManyToOne(type => Actualite, actualite => actualite.commentaires, {nullable:true})
    actualite:Actualite

    @OneToMany(type => Commentaire, commentaire => commentaire.id, {nullable:true})
    commentaire: Commentaire[]

}
