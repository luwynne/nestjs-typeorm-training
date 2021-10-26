import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column({default:true})
    admin: boolean;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert(){
        console.log('Inserted into the database with id '+this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log('Updated with the id'+this.id);
    }

}