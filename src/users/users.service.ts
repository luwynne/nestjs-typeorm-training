import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>){ 
        // this creates a dependencie of a class repository with the type of User
    }

    create(name: string, email:string, password: string, admin: boolean){
        const user = this.repo.create({name, email, password, admin});
        return this.repo.save(user);
    }

    findOne(id: number){ // it also accepts any other argumento, such as the email

        if(!id){
            return null;
        }

        const user = this.repo.findOne(id);
        if(!user){
            throw Error('User not found');
        }
        return  user;//this returns an object
    }

    find(email: string){
        return this.repo.find({email:email}); //this returns an array
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
          throw new Error('user not found');
        }
        // this assigns the properties from the payload and puts into the user object
        // also overwittes the properties that are already there
        Object.assign(user, attrs);
        return this.repo.save(user);
      }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user){
            throw new Error('User not found');
        }
        return this.repo.remove(user);
    }

}
