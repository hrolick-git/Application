import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    AuthModule,
    UsersModule,
    EventsModule,
    AiModule
  ],
  providers: [PrismaService]
})
export class AppModule {}
