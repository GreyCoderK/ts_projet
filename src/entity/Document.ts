import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { TypeDocument } from "./TypeDocument";
import { User } from "./User";
import { Note } from "./Note";
import { Suggestion } from "./Suggestion";
import { Correction } from "./Correction";
import { Commentaire } from "./Commentaire";
import { Classe } from "./Classe";
import { Abonnement } from "./Abonnement";

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    libelle: string

    @Column("text", {
        nullable:true
    })
    description: string

    @Column("varchar")
    path: string

    @Column("date", {nullable: true})
    createat: Date

    @Column("int",{default:0})
    telechargement: number

    @Column("int",{default:0})
    nombreVue: number

    @ManyToOne(type => User, user => user.documents, {nullable: true})
    user: User

    @ManyToOne(type => TypeDocument, typeDocument => typeDocument.documents, {nullable: true})
    typeDocument: TypeDocument

    @OneToMany(type => Note, note => note.document,{
        nullable:true,
        cascade: true
    })
    notes: Note[]

    @OneToMany(type => Suggestion, suggestion => suggestion.document,{
        nullable:true
    })
    suggestions: Suggestion[]

    @OneToMany(type => Correction, correction => correction.document,{
        nullable:true,
        cascade: true
    })
    correction: Correction[]

    @OneToMany(type => Commentaire, commentaire => commentaire.document,{
        nullable:true,
        cascade: true
    })
    commentaires: Commentaire[]

    @ManyToOne(type => Classe, classe => classe.documents, {nullable: true})
    classe : Classe

    @OneToMany(type => Abonnement, abonnement => abonnement.document,{
        nullable:true,
        cascade: true
    })
    abonnements: Abonnement[]
}