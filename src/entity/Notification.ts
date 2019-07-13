import { Entity, Column, OneToOne, ManyToOne } from "typeorm";
import { Abonnement } from "./Abonnement";
import { User } from "./User";

@Entity()
export class Notification {
    @Column("string")
    type: string

    @Column("text",{
        nullable: true
    })
    message: string

    @OneToOne(type => Abonnement, {
        nullable:true,
        cascade:true
    })
    abonnement: Abonnement;

    @ManyToOne(type => User, user => user.notifications, {nullable:true})
    user:User
}