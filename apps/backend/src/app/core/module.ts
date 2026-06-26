import { Module } from '@nestjs/common';
import { OpenAiModule } from './openai';

@Module({
  imports: [OpenAiModule],
})
export class CoreModule {}
