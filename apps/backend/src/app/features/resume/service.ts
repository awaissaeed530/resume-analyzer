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
      message: `Recieved resume file ${resumeFile.filename}`,
      resumeFile,
    });

    const resumeText = await this._docParserService.parseDocument(resumeFile);

    this.logger.log({ message: 'Parsed document content', resumeText });

    const analysis = await this._openaiService.generateResponse(resumeText);

    this.logger.log('AI analysis complete', analysis);

    console.log(analysis);

    return {
      matchScore: 100,
      strengths: [],
      missingSkills: [],
      suggestedImprovements: [],
      interviewRecommendations: [],
    };
  }
}
