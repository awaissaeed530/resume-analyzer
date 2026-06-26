import { Module } from '@nestjs/common';
import { ResumeModule } from './resume';

@Module({
  imports: [ResumeModule],
})
export class FeaturesModule {}
