import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';
import type { MulterFile } from 'nestjs-busboy';

export class AnalyzeResumeRequest {
  @IsDefined()
  @IsNotEmptyObject()
  resumeFile: MulterFile;

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
}
