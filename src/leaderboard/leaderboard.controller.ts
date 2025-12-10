import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('leaderboard')
@UseInterceptors(CacheInterceptor)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  @Post()
  create(@Body() createLeaderboardDto: CreateLeaderboardDto) {
    return this.leaderboardService.create(createLeaderboardDto);
  }

  @Get()
  findAll() {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaderboardDto: UpdateLeaderboardDto) {
    return this.leaderboardService.update(id, updateLeaderboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaderboardService.remove(id);
  }
}
