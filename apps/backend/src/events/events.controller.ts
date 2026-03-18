import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createEventSchema, CreateEventDto } from './dto/create-event.dto';
import { updateEventSchema, UpdateEventDto } from './dto/update-event.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  /* =======================
     🌍 Public routers
     ======================= */

  /** List public events */
  @Get('public')
  async publicList(@Query('archived') archived?: string) {
    return this.events.findPublicEvents(undefined, archived === 'true');
  }

  /** Public specific event */
  @Get('public/:id')
  async publicEvent(@Param('id') id: string) {
    const event = await this.events.findById(id);

    if (!event || event.visibility !== 'PUBLIC') {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  /** Get all tags */
  @Get('tags')
  async getTags() {
    return this.events.getTags();
  }

  /* =======================
     🔐 Authenticated routers
     ======================= */

  /** List events (PUBLIC + your PRIVATE) */
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any, @Query('archived') archived?: string) {
    return this.events.list(req.user.id, undefined, archived === 'true');
  }

  /** Specific event (PUBLIC or your PRIVATE) */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any) {
    return this.events.get(id, req.user.id);
  }

  /** Create event */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe(createEventSchema))
  async create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.events.create(dto, req.user.id);
  }

  /** Update event (only organizer) */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe(updateEventSchema)) dto: UpdateEventDto, // ДОДАЙТЕ СЮДИ
    @Req() req: any,
  ) {
    return this.events.update(id, dto, req.user.id);
  }

  /** Delete event (only organizer) */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.events.delete(id, req.user.id);
  }

  /** Join */
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Req() req: any) {
    return this.events.join(id, req.user.id);
  }

  /** Leave */
  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Req() req: any) {
    return this.events.leave(id, req.user.id);
  }
}