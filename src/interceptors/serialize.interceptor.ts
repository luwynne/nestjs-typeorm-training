import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { nextTick } from 'process';
import { UserDto } from 'src/users/dtos/user.dto';

interface ClassConstructor{
    new(...args:any[]):{}
}

export function Serialize(dto: ClassConstructor){ //it has a any type before
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto:any){}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // runs before the request is handles by the request handler
        return handler.handle().pipe(
            map((data:any) => {
                //running before the response is sent out
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                });
            })
        )
    }

}
