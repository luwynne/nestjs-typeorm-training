import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

// this is a declaration of a global variable, that goes find the Express propety, then the Request interface
// and adds the propety currentUser to it globally
declare global{ 
    namespace Express{
        interface Request{
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{

    constructor(private usersService: UsersService){}

    async use(req: any, res: any, next: NextFunction) {
        const { userId } = req.session || {}

        if(userId){
            const user = await this.usersService.findOne(userId);
            req.currentUser = user;
        }
        next();
    }

}