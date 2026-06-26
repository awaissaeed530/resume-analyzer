import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    this.client = new OpenAI();
    this.model = process.env.OPENAI_MODEL || 'gpt-5-pro';
  }

  async generateResponse(input: string): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      input,
    });

    return response.output_text;
  }
}
