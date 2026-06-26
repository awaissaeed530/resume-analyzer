import { Module } from '@nestjs/common';
import { BusboyModule, memoryStorage } from 'nestjs-busboy';
import { DocParserModule } from '../../core';
import { ResumeController } from './controller';
import { ResumeService } from './service';

@Module({
  imports: [
    DocParserModule,
    BusboyModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
