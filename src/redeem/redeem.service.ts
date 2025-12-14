import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { UpdateRedeemDto } from './dto/update-redeem.dto';
import { redeem, redeemSchema } from '../schema/redeem.schema';
import { transaction, transactionSchema } from '../schema/transaction.schema';
import { User, UserSchema } from '../schema/user.schema';
import { leaderboardSchema } from '../schema/leaderboard.schema';

@Injectable()
export class RedeemService {
  constructor(
    @InjectModel(redeemSchema.name) private redeemModel: Model<redeemSchema>,
    @InjectModel(transactionSchema.name) private transactionModel: Model<transactionSchema>,
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    @InjectModel(leaderboardSchema.name) private leaderboardModel: Model<leaderboardSchema>,
  ) { }

  async create(createRedeemDto: CreateRedeemDto): Promise<redeemSchema> {
    const createdRedeem = new this.redeemModel(createRedeemDto);
    return createdRedeem.save();
  }

  async findAll(): Promise<redeemSchema[]> {
    return this.redeemModel.find().exec();
  }

  async findOne(id: string): Promise<redeemSchema> {
    const redeem = await this.redeemModel.findById(id).exec();
    if (!redeem) {
      throw new NotFoundException(`Redeem with ID ${id} not found`);
    }
    return redeem;
  }

  async update(id: string, updateRedeemDto: UpdateRedeemDto): Promise<redeemSchema> {
    const updatedRedeem = await this.redeemModel
      .findByIdAndUpdate(id, updateRedeemDto, { new: true })
      .exec();
    if (!updatedRedeem) {
      throw new NotFoundException(`Redeem with ID ${id} not found`);
    }
    return updatedRedeem;
  }

  async remove(id: string): Promise<redeemSchema> {
    const deletedRedeem = await this.redeemModel.findByIdAndDelete(id).exec();
    if (!deletedRedeem) {
      throw new NotFoundException(`Redeem with ID ${id} not found`);
    }
    return deletedRedeem;
  }

  async claim(redeemId: string, userId: string): Promise<any> {
    const item = await this.redeemModel.findById(redeemId);
    if (!item) throw new NotFoundException('Redeem item not found');

    const user = await this.userModel.findOne({ Yid: userId }) as any;
    if (!user) throw new NotFoundException('User not found');

    if (user.points < item.points) {
      // throw new BadRequestException('Insufficient points');
      // BadRequestException needs to be imported
      throw new BadRequestException('Insufficient points');
    }

    // Deduct points
    user.points -= item.points;

    // Create transaction
    const newTransaction = new this.transactionModel({
      event: `Redeem: ${item.name}`,
      user: { Yid: userId, name: user.name },
      points: -item.points,
      admin: 'System',
    });
    const savedTransaction = await newTransaction.save();

    // Update user transaction history
    if (!user.transaction) user.transaction = {};
    user.transaction = { ...user.transaction, [savedTransaction._id.toString()]: savedTransaction };
    user.markModified('transaction');
    await user.save();

    // Update redeem item transaction history
    if (!item.transactions) item.transactions = {};
    item.transactions = { ...item.transactions, [savedTransaction._id.toString()]: savedTransaction };
    item.markModified('transactions');
    await item.save();

    await this.updateLeaderboard(user.name, user.points);

    return { message: 'Redemption successful', transaction: savedTransaction };
  }

  private async updateLeaderboard(name: string, points: number) {
    await this.leaderboardModel.findOneAndUpdate({ name }, { points }, { upsert: true });
  }

  async approve(redeemId: string, transactionId: string): Promise<redeemSchema> {
    const redeemItem = await this.redeemModel.findById(redeemId);
    if (!redeemItem) {
      throw new NotFoundException('Redeem item not found');
    }

    const transaction = redeemItem.transactions ? redeemItem.transactions[transactionId] : null;

    if (!transaction) {
      throw new NotFoundException('Transaction not found in pending requests');
    }

    // Add to approved
    redeemItem.approved = { ...redeemItem.approved, [transactionId]: transaction };

    // Remove from transactions (pending)
    const newTransactions = { ...redeemItem.transactions };
    delete newTransactions[transactionId];
    redeemItem.transactions = newTransactions;

    redeemItem.markModified('approved');
    redeemItem.markModified('transactions');

    // Increment completed count
    redeemItem.completed = (redeemItem.completed || 0) + 1;

    return redeemItem.save();
  }
}
