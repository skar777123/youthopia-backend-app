import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateEventFeedbackDto } from './dto/create-event-feedback.dto';
import { CreateSpinFeedbackDto } from './dto/create-spin-feedback.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Post('event')
    createEventFeedback(@Body() createEventFeedbackDto: CreateEventFeedbackDto) {
        return this.feedbackService.createEventFeedback(createEventFeedbackDto);
    }

    @Get('event')
    @UseInterceptors(CacheInterceptor)
    findAllEventFeedback() {
        return this.feedbackService.findAllEventFeedback();
    }

    @Post('spin')
    createSpinFeedback(@Body() createSpinFeedbackDto: CreateSpinFeedbackDto) {
        return this.feedbackService.createSpinFeedback(createSpinFeedbackDto);
    }

    @Get('spin')
    @UseInterceptors(CacheInterceptor)
    findAllSpinFeedback() {
        return this.feedbackService.findAllSpinFeedback();
    }
}
