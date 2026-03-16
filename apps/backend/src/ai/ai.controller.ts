import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ask')
  async ask(@Body('question') question: string, @Req() req: any) {
    return this.ai.ask(question, req.user.id);
  }
}