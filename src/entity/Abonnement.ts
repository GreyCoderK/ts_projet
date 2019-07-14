import { Entity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Document } from "./Document";
import { Notification } from "./Notification";
import { Actualite } from "./Actualite";

@Entity()
export class Abonnement {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.abonnements, {nullable:true})
    user:User

    @ManyToOne(type => Document, document => document.abonnements, {nullable:true})
    document:Document

    @ManyToOne(type => Actualite, actualite => actualite.abonnements, {nullable:true})
    actualite:Actualite
    
    @OneToOne(type => Notification, {
        nullable:true,
        cascade:true
    })
    @JoinColumn()
    notification: Notification;
}