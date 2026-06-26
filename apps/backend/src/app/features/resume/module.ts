import { Module } from '@nestjs/common';
import { BusboyModule } from 'nestjs-busboy';
import { DocParserModule } from '../../core';

@Module({
  imports: [BusboyModule, DocParserModule],
})
export class ResumeModule {}
