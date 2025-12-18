import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    findAll() {
        return this.adminService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.adminService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAdminDto: CreateAdminDto) {
        return this.adminService.update(id, updateAdminDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.adminService.remove(id);
    }
}
