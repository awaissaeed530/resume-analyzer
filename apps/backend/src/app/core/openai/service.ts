import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { join } from 'path';
import { z } from 'zod';
import {
  circuitBreaker,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleAll,
  retry,
  wrap,
  timeout,
  TimeoutStrategy,
} from 'cockatiel';
import { OPENAI_CONFIG } from '../../config';
import { OpenAIError, OpenAIOutputError } from './error';

const ResumeAnalysisSchema = z.object({
  matchScore: z.number(),
  strengths: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestedImprovements: z.array(z.string()),
  interviewRecommendations: z.array(z.string()),
});
type ResumeAnalysisResponse = z.infer<typeof ResumeAnalysisSchema>;

const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff(),
});
const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10 * 1000,
  breaker: new ConsecutiveBreaker(3),
});
const timeoutPolicy = timeout(30_000, TimeoutStrategy.Aggressive);
const resilianyPolicy = wrap(timeoutPolicy, retryPolicy, circuitBreakerPolicy);

@Injectable()
export class OpenAiService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_CONFIG.API_KEY,
    });
    this.model = OPENAI_CONFIG.MODEL;
  }

  async performResumeAnalysis(
    resume: string,
    jobDescription: string,
  ): Promise<ResumeAnalysisResponse> {
    try {
      const systemPrompt = await this.getSystemPrompt();
      const userPrompt = this.getUserPrompt(resume, jobDescription);

      const response = await resilianyPolicy.execute(() =>
        this.client.responses.parse({
          model: this.model,
          input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          text: {
            verbosity: 'medium',
            format: zodTextFormat(ResumeAnalysisSchema, 'resume_analysis', {
              description: 'Structured resume analysis response',
            }),
          },
        }),
      );

      if (!response.output_parsed) {
        throw new OpenAIOutputError('OpenAI did not return a valid response');
      }

      return response.output_parsed;
    } catch (error) {
      throw new OpenAIError('OpenAI did not return a valid response', error);
    }
  }

  private async getSystemPrompt(): Promise<string> {
    return readFile(
      join(__dirname, '/assets/prompts/system_prompt.md'),
      'utf8',
    );
  }

  private getUserPrompt(resume: string, jobDescription: string): string {
    return `
    [RESUME START]
    ${resume}
    [RESUME END]

    [JOB DESCRIPTION START]
    ${jobDescription}
    [JOB DESCRIPTION END]
    `;
  }
}
