import { Body, Controller, Post, Get, Param, UseGuards, Patch, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import {Request} from 'express';
import { JwtAuthGuard } from '../auth/auth.service';


@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ){}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }

    @Post('login')
    async login(@Body() body: {email: string; password: string}){
        return this.authService.login(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request){
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
        async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto){
            const user = req.user;
            await this.usersService.update(user.id, updateUserDto);
            return this.usersService.findOneByEmail(user.email)
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('profile')
    async deleteProfile(@Req() req: Request){
        const user = req.user;
        await this.usersService.remove(user.id)
    }

}
