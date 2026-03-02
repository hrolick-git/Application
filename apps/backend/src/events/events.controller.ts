import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createEventSchema, CreateEventDto } from './dto/create-event.dto';
import { updateEventSchema, UpdateEventDto } from './dto/update-event.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('events')
export class EventsController {
  constructor(private events: EventsService) {}

  @Get()
  async list(@Req() req: any) {
    const userId = req.user?.id;
    return this.events.list(userId);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: any) {
    return this.events.get(id, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe(createEventSchema))
  async create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.events.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe(updateEventSchema))
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Req() req: any) {
    return this.events.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.events.delete(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Req() req: any) {
    return this.events.join(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Req() req: any) {
    return this.events.leave(id, req.user.id);
  }
}
