import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResumeService } from './service';
import { AnalyzeResumeRequest, AnalyzeResumeResponse } from './types';

@Controller('resume')
export class ResumeController {
  constructor(private readonly _resumeService: ResumeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async analyzeResume(
    @Body() request: AnalyzeResumeRequest,
  ): Promise<AnalyzeResumeResponse> {
    return this._resumeService.analyzeResume(request);
  }
}
