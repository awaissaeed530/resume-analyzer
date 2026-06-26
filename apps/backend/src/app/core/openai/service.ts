import { Injectable } from '@nestjs/common';
import {
  circuitBreaker,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleAll,
  retry,
  timeout,
  TimeoutStrategy,
  wrap,
} from 'cockatiel';
import { readFile } from 'fs/promises';
import { setTimeout } from 'node:timers/promises';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { join } from 'path';
import { z } from 'zod';
import { OPENAI_CONFIG } from '../../config';
import { AnalyzeResumeResponse } from '../../features/resume';
import { OpenAIError, OpenAIOutputError } from './error';

const ResumeAnalysisSchema = z.object({
  matchScore: z.number(),
  strengths: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestedImprovements: z.array(z.string()),
  interviewRecommendations: z.array(z.string()),
});

/** Retry policy for OpenAI API calls. Retries up to 3 times with exponential backoff. */
const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff(),
});
/** Circuit breaker policy, breaks after 3 consecutive failures, with a half-open period of 10 seconds. */
const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10 * 1000,
  breaker: new ConsecutiveBreaker(3),
});
/** Timeout policy, with aggressive 30 second timeout strategy */
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

  /** Perform resume analysis using OpenAI API */
  async performResumeAnalysis(
    resume: string,
    jobDescription: string,
  ): Promise<AnalyzeResumeResponse> {
    try {
      const systemPrompt = await this.getSystemPrompt();
      const userPrompt = this.getUserPrompt(resume, jobDescription);

      await setTimeout(3000);
      return {
        matchScore: 75,
        strengths: [
          'TypeScript',
          'Angular',
          'Node.js ecosystem (NestJS, Express)',
          'PostgreSQL',
          'AWS',
          'Terraform',
          'CI/CD automation (GitHub Actions)',
          'Distributed system design (RabbitMQ, SQS)',
          'Asynchronous processing',
          'Observability (OpenTelemetry, Datadog)',
        ],
        missingSkills: [
          'React',
          'Ruby on Rails',
          'Programmatic PDF generation (Puppeteer)',
          'Transactional email services (Postmark, SendGrid)',
          'QuickBooks API or financial/accounting workflow experience',
          'AWS S3 for media storage with optimized multi-photo uploads',
        ],
        suggestedImprovements: [
          'Emphasize experience or familiarity with React or explain architectural reasons for different frontend framework choice since job prefers React',
          'Highlight any experience or knowledge related to transactional email systems and programmatic PDF generation, or express willingness to learn',
          'Include more explicit examples of building financial or accounting workflows if applicable, or mention transferable experience',
          'Quantify business impact of operational improvements, such as cost savings or revenue protection, with exact figures where possible',
          'Frame leadership and ownership themes explicitly to address self-directed execution and independent ownership',
          'Mention or elaborate on experience with client communication or reporting that demonstrates strong written communication skills for non-technical stakeholders',
        ],
        interviewRecommendations: [
          "Discuss in depth candidate's experience designing and scaling asynchronous queue pipelines and integration with distributed workers related to real-time business critical operations",
          "Validate candidate's familiarity with Postgres schemas, including use of JSONB fields and complex relational modeling relevant to property-centric data models",
          "Explore candidate's approach to frontend architecture, especially differences between Angular and React and ability to adapt or override recommended tech stack",
          "Probe candidate's experience and strategies for CI/CD pipeline design, automated linting, testing and ensuring high deployment velocity in mission-critical environments",
          "Examine candidate's usage of observability tools like OpenTelemetry and Datadog in reducing production incidents and improving system reliability",
          'Ask how candidate applies AI-augmented development tools in their workflow to ensure code quality and efficiency',
          'Scenario-based question: Design an architecture for handling multi-week job execution workflows with dynamic budget tracking and automated client portals, focusing on maintainability and extensibility',
        ],
        tokens: 4259,
      };

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

      return {
        ...response.output_parsed,
        tokens: response.usage?.total_tokens,
      };
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
