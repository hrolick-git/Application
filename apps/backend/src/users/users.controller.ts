import { Body, Controller, Get, Patch, Post, Query, Param, Req, UseGuards } from '@nestjs/common';
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
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      vibecoins: user.vibecoins,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/events')
  getMyEvents(@Req() req: any, @Query('archived') archived?: string) {
    return this.usersService.eventsForUser(req.user.id, archived === 'true');
  }

  @Get('creator-pages/:slug')
  getCreatorPageBySlug(@Param('slug') slug: string, @Query('archived') archived?: string) {
    return this.usersService.getCreatorPageBySlug(slug, archived === 'true');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/creator-page')
  getMyCreatorPage(@Req() req: any) {
    return this.usersService.getMyCreatorPage(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/creator-page')
  createMyCreatorPage(
    @Req() req: any,
    @Body() body: { slug: string; title: string; description?: string | null },
  ) {
    return this.usersService.createMyCreatorPage(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/creator-page')
  updateMyCreatorPage(
    @Req() req: any,
    @Body() body: { title: string; description?: string | null },
  ) {
    return this.usersService.updateMyCreatorPage(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/creator-page/slug')
  renameMyCreatorPageSlug(@Req() req: any, @Body('slug') slug: string) {
    return this.usersService.renameMyCreatorPageSlug(req.user.id, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/redeem-code')
  redeemCode(@Req() req: any, @Body('code') code: string) {
    return this.usersService.redeemVibecoinCode(req.user.id, code);
  }
}
