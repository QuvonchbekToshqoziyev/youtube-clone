import { Module } from '@nestjs/common';
import { SubcriptionsService } from './subcriptions.service';
import { SubcriptionsController } from './subcriptions.controller';

@Module({
  controllers: [SubcriptionsController],
  providers: [SubcriptionsService],
})
export class SubcriptionsModule {}
