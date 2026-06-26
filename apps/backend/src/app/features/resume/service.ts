import { Injectable } from '@nestjs/common';
import { DocParserService, OpenAiService } from '../../core';
import { AnalyzeResumeRequest, AnalyzeResumeResponse } from './types';

@Injectable()
export class ResumeService {
  constructor(
    private readonly _openaiService: OpenAiService,
    private readonly _docParserService: DocParserService,
  ) {}

  async analyzeResume(
    request: AnalyzeResumeRequest,
  ): Promise<AnalyzeResumeResponse> {
    const { resumeFile, jobDescription } = request;

    const resumeText = await this._docParserService.parseDocument(resumeFile);

    const analysis = await this._openaiService.generateResponse(
      'gpt-5-pro',
      resumeText,
    );

    return {
      matchScore: 100,
      strengths: [],
      missingSkills: [],
      suggestedImprovements: [],
      interviewRecommendations: [],
    };
  }
}
