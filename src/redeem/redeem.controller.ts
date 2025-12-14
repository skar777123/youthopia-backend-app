import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { UpdateRedeemDto } from './dto/update-redeem.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('redeem')
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) { }

  @Post()
  create(@Body() createRedeemDto: CreateRedeemDto) {
    return this.redeemService.create(createRedeemDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.redeemService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id') id: string) {
    return this.redeemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRedeemDto: UpdateRedeemDto) {
    return this.redeemService.update(id, updateRedeemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redeemService.remove(id);
  }

  @Post(':id/claim')
  claim(@Param('id') id: string, @Body('userId') userId: string) {
    return this.redeemService.claim(id, userId);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body('transactionId') transactionId: string) {
    return this.redeemService.approve(id, transactionId);
  }
}
