import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI();
  }

  async generateResponse(model: string, input: string): Promise<string> {
    const response = await this.client.responses.create({
      model,
      input,
    });

    return response.output_text;
  }
}
