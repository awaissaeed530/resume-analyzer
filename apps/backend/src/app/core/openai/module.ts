import { Global, Module } from '@nestjs/common';
import { OpenAiService } from './service';

@Global()
@Module({
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
