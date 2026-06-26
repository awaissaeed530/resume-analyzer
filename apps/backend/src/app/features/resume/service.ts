import { Injectable, Logger } from '@nestjs/common';
import type { MulterFile } from 'nestjs-busboy';
import { DocParserService, OpenAiService } from '../../core';
import { AnalyzeResumeRequest, AnalyzeResumeResponse } from './types';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    private readonly _openaiService: OpenAiService,
    private readonly _docParserService: DocParserService,
  ) {}

  async analyzeResume(
    resumeFile: MulterFile,
    request: AnalyzeResumeRequest,
  ): Promise<AnalyzeResumeResponse> {
    const { jobDescription } = request;

    this.logger.log({
      message: `Recieved ${resumeFile.mimetype} resume file`,
    });

    const resumeText = await this._docParserService.parseDocument(resumeFile);

    return this._openaiService.performResumeAnalysis(
      resumeText,
      jobDescription,
    );
  }
}
