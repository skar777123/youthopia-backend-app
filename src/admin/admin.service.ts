import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schema/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

    async create(createAdminDto: CreateAdminDto): Promise<Admin> {
        const createdAdmin = new this.adminModel(createAdminDto);
        return createdAdmin.save();
    }

    async findAll(): Promise<Admin[]> {
        return this.adminModel.find().exec();
    }

    async findOne(id: string): Promise<Admin | null> {
        return this.adminModel.findById(id).exec();
    }

    async update(id: string, updateAdminDto: CreateAdminDto): Promise<Admin | null> {
        return this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Admin | null> {
        return this.adminModel.findByIdAndDelete(id).exec();
    }
}
