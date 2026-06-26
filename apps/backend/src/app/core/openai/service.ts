import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { join } from 'path';
import { z } from 'zod';
import { OpenAIError, OpenAIOutputError } from './error';

const ResumeAnalysisSchema = z.object({
  matchScore: z.number(),
  strengths: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestedImprovements: z.array(z.string()),
  interviewRecommendations: z.array(z.string()),
});
type ResumeAnalysisResponse = z.infer<typeof ResumeAnalysisSchema>;

@Injectable()
export class OpenAiService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    this.client = new OpenAI();
    this.model = process.env.OPENAI_MODEL || 'gpt-5-pro';
  }

  async performResumeAnalysis(
    resume: string,
    jobDescription: string,
  ): Promise<ResumeAnalysisResponse> {
    try {
      const systemPrompt = await this.getSystemPrompt();
      const userPrompt = this.getUserPrompt(resume, jobDescription);

      /*
    return {
      matchScore: 70,
      strengths: [
        'Extensive experience with TypeScript and full-stack development including backend and frontend frameworks, which aligns strongly with the React/TypeScript frontend and Node.js backend tech stack requirements.',
        'Proven history of designing scalable, production-grade B2B applications with robust backend architectures and cloud-native systems (AWS, Terraform), matching the need for building a comprehensive operating system.',
        'Strong background in asynchronous queue-based architectures and event-driven systems, which indicates capability in handling complex workflows and data synchronization similar to the dual job execution workflows described.',
        'Experience owning end-to-end product lifecycle and making major technical decisions, demonstrating the self-directed execution and ownership the role requires.',
        'Demonstrated ability to optimize system performance and implement CI/CD pipelines, which supports the need for disciplined engineering and continuous delivery.',
        'Hands-on technical leadership and mentoring skills, aligning with the need for autonomous ownership and direct communication with stakeholders.',
      ],
      missingSkills: [
        'No explicit experience with React framework in frontend development; current expertise is in Angular and Ionic which differs from the specified React.',
        'Lack of direct experience with Rails or Django frameworks as backend options, the JD emphasizes Node.js or Ruby on Rails.',
        'No mention of programmatic PDF generation (e.g., using Puppeteer) or transactional email systems such as Postmark or SendGrid, which are preferred in the JD.',
        'No explicit experience cited with AWS S3 for media storage workflows or multi-photo upload optimization.',
        'No direct reference to working with financial or accounting workflows or relevant API integrations like QuickBooks API.',
        'No demonstrated prior domain experience in construction, field services, or property management technology.',
        'Lack of specific mention regarding fluency or practical usage of AI-augmented development tools like Claude Code, Cursor, or GitHub Copilot.',
      ],
      suggestedImprovements: [
        'Emphasize any experience or familiarity with React and Node.js, or explain architectural decisions if using alternative frameworks to show flexibility and alignment with JD stack.',
        'Add quantifiable metrics or examples of working on financial workflows or document generation pipelines to align with PDF generation and transactional email requirements.',
        'Specify any practical use of AI-assisted development tools in the workflow to address this emerging qualification explicitly.',
        'Highlight any project management or CRM related software experience to stress B2B operational product experience supporting critical business functions.',
        'Clarify communication methods and examples of direct updates given to non-technical stakeholders to showcase strong written communication skills.',
        'Mention any experience or understanding of PostgreSQL JSONB utilization or complex data migrations to show fit for the phased data migration tasks.',
        'If applicable, note exposure or willingness to learn domain knowledge in construction or property management technology to better fit the preferred skills.',
      ],
      interviewRecommendations: [
        "Conduct deep architectural discussion on the candidate's experience designing scalable cloud-native backend systems using .NET and AWS, focusing on trade-offs made for performance and fault tolerance.",
        "Explore candidate's approach to asynchronous communication pipelines using RabbitMQ and AWS SQS and how that experience can translate to complex job execution workflows with phased deployments.",
        "Evaluate candidate's proficiency with frontend technologies and their adaptability by probing familiarity with React or willingness to quickly adopt it given current expertise in Angular and Ionic.",
        "Assess the candidate's familiarity and experience with data migration strategies especially in large, multi-entity PostgreSQL schemas, including usage of JSONB if any.",
        'Probe practical usage of CI/CD pipelines and automated testing frameworks to understand their capability to maintain engineering standards and deliver consistent releases.',
        "Investigate candidate's experience with stakeholder communication by requesting examples of technical decision trade-offs explained to non-technical audiences, simulating direct-to-owner communication.",
        "Evaluate candidate's use of AI-assisted coding tools and their strategy to balance AI-generated code trust and manual override/refactoring.",
        'Discuss any exposure or knowledge gaps related to the preferred skills such as programmatic PDF generation, transactional email integrations, AWS S3 media workflows, and domain-specific construction or property management technology.',
      ],
    };
    */

      const response = await this.client.responses.parse({
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
      });

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
