import { Module } from '@nestjs/common';
import { DocParserService } from './service';

@Module({
  providers: [DocParserService],
  exports: [DocParserService],
})
export class DocParserModule {}
