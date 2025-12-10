import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { transaction, transactionSchema } from '../schema/transaction.schema';
import { User, UserSchema } from '../schema/user.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(transactionSchema.name) private transactionModel: Model<transactionSchema>,
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto): Promise<transactionSchema> {
    const userYid = createTransactionDto.user['Yid'];
    let user: (UserSchema & { save: () => Promise<any>; markModified: (path: string) => void; _id: any }) | null = null;
    if (userYid) {
      user = await this.userModel.findOne({ Yid: userYid }) as any;
    }

    if (user) {
      if (createTransactionDto.points < 0 && user.points + createTransactionDto.points < 0) {
        throw new BadRequestException('Insufficient points');
      }
      user.points += createTransactionDto.points;
      await user.save();
    }

    const createdTransaction = new this.transactionModel(createTransactionDto);
    const savedTransaction = await createdTransaction.save();

    if (user) {
      if (!user.transaction) user.transaction = {};
      user.transaction = { ...user.transaction, [savedTransaction._id.toString()]: savedTransaction };
      user.markModified('transaction');
      await user.save();
    }

    return savedTransaction;
  }

  async findAll(): Promise<transactionSchema[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<transactionSchema> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<transactionSchema> {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return updatedTransaction;
  }

  async remove(id: string): Promise<transactionSchema> {
    const deletedTransaction = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!deletedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return deletedTransaction;
  }
}
