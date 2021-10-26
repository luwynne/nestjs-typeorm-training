import { Body, 
        Controller, 
        Get, 
        Post, 
        Patch, 
        Param, 
        Query, 
        Delete, 
        NotFoundException,
        Session,
        UseInterceptors,
        UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // applying it here for the controller or in the function for function scope only
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(private userService: UsersService, private authService: AuthService){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session:any){
        const user = await this.authService.signup(body.name, body.email, body.password, body.admin);
        session.userId = user.id;
        return user;
    }

    @Get('/logged_user')
    loggedUser(@Session() session: any){
        return this.userService.findOne(session.userId);
    }

    @Post('/signin')
    async signin(@Body() body: LoginUserDto, @Session() session:any){
        const user = await  this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session()session:any){
        session.userId = null;
    }

    @Get('/who_ami')
    @UseGuards(AuthGuard) // according to the guard, this method can only be ran if the user has session
    whoAmI(@CurrentUser() user: User){
        return user;
    }

    // @UseInterceptors(SerializeInterceptor) //using the entity interceptors
     //this other will define that for this handler we want an specific dto 
    @Get('/:id')
    async findUser(@Param('id') id: string){ // even if thats a number, the request gives us into a number ans we have to parse it
        const user = this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }

}
