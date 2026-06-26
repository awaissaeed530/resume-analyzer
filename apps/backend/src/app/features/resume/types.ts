import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export const ACCEPTED_MIME_TYPES = [
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export class AnalyzeResumeRequest {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  jobDescription: string;
}

export class AnalyzeResumeResponse {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  suggestedImprovements: string[];
  interviewRecommendations: string[];
  tokens?: number;
}
