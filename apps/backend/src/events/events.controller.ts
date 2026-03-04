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
  UsePipes,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createEventSchema, CreateEventDto } from './dto/create-event.dto';
import { updateEventSchema, UpdateEventDto } from './dto/update-event.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('events')
export class EventsController {
  constructor(private events: EventsService) {}

  /** Список подій */
  @Get()
  async list(@Req() req: any) {
    const userId = req.user?.id;
    return this.events.list(userId);
  }

  /** Конкретна подія */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id; // отримуємо id залогіненого користувача
    return this.events.get(id, userId); // передаємо в сервіс
  }

  /** Публічні події */
  @Get('public')
  async publicList() {
    return this.events.findPublicEvents();
  }

  /** Публічна конкретна подія */
  @Get('public/:id')
  async publicEvent(@Param('id') id: string) {
    const event = await this.events.findById(id);
    if (!event || event.visibility !== 'PUBLIC') {
      throw new NotFoundException('Подія не знайдена');
    }
    return event;
  }

  /** Створення події */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe(createEventSchema))
  async create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.events.create(dto, req.user.id);
  }

  /** Редагування події */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe(updateEventSchema))
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Req() req: any) {
    return this.events.update(id, dto, req.user.id);
  }

  /** Видалення події */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.events.delete(id, req.user.id);
  }

  /** Join / Leave */
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