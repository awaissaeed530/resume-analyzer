import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, type MulterFile } from 'nestjs-busboy';
import { ResumeService } from './service';
import { AnalyzeResumeRequest, AnalyzeResumeResponse } from './types';

@Controller('resume')
export class ResumeController {
  constructor(private readonly _resumeService: ResumeService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('resumeFile', {
      // fileFilter: (_, { mimetype }) => ACCEPTED_MIME_TYPES.includes(mimetype),
    }),
  )
  async analyzeResume(
    @UploadedFile() resumeFile: MulterFile,
    @Body() request: AnalyzeResumeRequest,
  ): Promise<AnalyzeResumeResponse> {
    return this._resumeService.analyzeResume(resumeFile, request);
  }
}
