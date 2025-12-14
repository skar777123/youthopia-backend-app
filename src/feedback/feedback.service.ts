import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventFeedback, EventFeedbackDocument, SpinFeedback, SpinFeedbackDocument } from '../schema/feedback.schema';
import { CreateEventFeedbackDto } from './dto/create-event-feedback.dto';
import { CreateSpinFeedbackDto } from './dto/create-spin-feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(EventFeedback.name) private eventFeedbackModel: Model<EventFeedbackDocument>,
        @InjectModel(SpinFeedback.name) private spinFeedbackModel: Model<SpinFeedbackDocument>,
    ) { }

    async createEventFeedback(createEventFeedbackDto: CreateEventFeedbackDto): Promise<EventFeedback> {
        const createdFeedback = new this.eventFeedbackModel(createEventFeedbackDto);
        return createdFeedback.save();
    }

    async findAllEventFeedback(): Promise<EventFeedback[]> {
        return this.eventFeedbackModel.find().exec();
    }

    async createSpinFeedback(createSpinFeedbackDto: CreateSpinFeedbackDto): Promise<SpinFeedback> {
        const createdFeedback = new this.spinFeedbackModel(createSpinFeedbackDto);
        return createdFeedback.save();
    }

    async findAllSpinFeedback(): Promise<SpinFeedback[]> {
        return this.spinFeedbackModel.find().exec();
    }
}
