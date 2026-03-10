import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      return null;
    }
    return { id: user.id, email: user.email };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/events')
  getMyEvents(@Req() req: any) {
    return this.usersService.eventsForUser(req.user.id);
  }
}