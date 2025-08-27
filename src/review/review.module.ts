import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewProvider } from './providers/review-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewService, ReviewProvider],
  exports: [ReviewService],
})
export class ReviewModule {}
