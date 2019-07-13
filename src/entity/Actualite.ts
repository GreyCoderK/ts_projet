import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Image } from "./Image";
import { Commentaire } from "./Commentaire";
import { Abonnement } from "./Abonnement";

@Entity()
export class Actualite {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    libelle: string

    @Column("text")
    description: string

    @Column("date")
    date: Date

    @Column("tinyint")
    new: Boolean

    @OneToMany(type => Image, image => image.actualite, {
        nullable:true,
        cascade: true
    })
    images: Image[]

    @OneToMany(type => Commentaire, commentaire => commentaire.actualite, {
        nullable:true,
        cascade: true
    })
    commentaires: Commentaire[]

    @OneToMany(type => Abonnement, abonnement => abonnement.actualite, {
        nullable:true,
        cascade: true
    })
    abonnements: Abonnement[]
}