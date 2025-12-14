import { Controller, Post, Get, Put, Delete, Body, Param, UseInterceptors, NotFoundException } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RedeemDto } from './dto/redeem.dto';


@UseInterceptors(CacheInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('data/:yid')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  async fetchData(@Param('yid') yid: string) {
    const user = await this.userService.fetchData(yid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put('redeem/:yid')
  async redeem(@Param('yid') yid: string, @Body() redeemDto: RedeemDto) {
    return this.userService.redeem(yid, redeemDto);
  }

  @Post('spin/:yid')
  async spinWheel(@Param('yid') yid: string) {
    return this.userService.spinWheel(yid);
  }

  @Get('points/:yid')
  async getPoints(@Param('yid') yid: string) {
    return this.userService.getPoints(yid);
  }

  @Get('spins/:yid')
  async getSpins(@Param('yid') yid: string) {
    return this.userService.getSpins(yid);
  }

  @Delete(':yid')
  async deleteUser(@Param('yid') yid: string) {
    return this.userService.deleteUser(yid);
  }
}
