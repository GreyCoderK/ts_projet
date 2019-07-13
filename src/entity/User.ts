import {ManyToOne, OneToMany ,Entity, PrimaryGeneratedColumn, Column} from "typeorm"
import { TypeUser } from "./TypeUser";
import { Document } from "./Document";
import { Note } from "./Note";
import { Image } from "./Image";
import { Commentaire } from "./Commentaire";
import { Abonnement } from "./Abonnement";
import { Notification } from "./Notification";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length:20
    })
    nom: string

    @Column({
        length:30
    })
    prenoms: string

    @Column("date",{
        nullable: true
    })
    birthday: Date

    @Column("varchar",{
        length: 35,
    })
    email: string

    @Column("varchar",{
        length: 35,
    })
    contact: string

    @Column("varchar")
    password: string

    @ManyToOne(type => TypeUser, typeUser => typeUser.users,{nullable: true})
    typeUser : TypeUser

    @OneToMany(type => Document, document => document.user,{
        nullable: true,
        cascade: true
    })
    documents : Document[]

    @OneToMany(type => Note, note => note.document,{
        nullable:true,
        cascade: true
    })
    notes: Note[]

    @OneToMany(type => Image, image => image.user,{
        nullable:true,
        cascade: true
    })
    images: Image[]

    @OneToMany(type => Commentaire, commentaire => commentaire.user,{
        nullable:true,
        cascade: true
    })
    commentaires: Commentaire[]

    @OneToMany(type => Abonnement, abonnement => abonnement.user,{
        nullable:true,
        cascade: true
    })
    abonnements: Abonnement[]

    @OneToMany(type => Notification, notification => notification.user,{
        nullable:true,
        cascade: true
    })
    notifications: Notification[]
}
