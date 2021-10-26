import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{

    constructor(private usersService: UsersService){}

    async signup(name: string, email: string, password: string, admin: boolean){
        const users = await this.usersService.find(email);

        if(users.length){
            throw new BadRequestException('Email in use');
        }

        // generate salt
        const salt = randomBytes(8).toString('hex');
        // has salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        //join the hashed result and the salt together
        const result = salt + '.'+ hash.toString('hex');
        //create new user and save on db
        const user = await this.usersService.create(name, email, result, admin);

        return user;
    }

    async signin(email: string, password: string){
        const [user] = await this.usersService.find(email);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');
        console.log(storedHash);
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('Bad password');
        }
        return user; 
    }

}