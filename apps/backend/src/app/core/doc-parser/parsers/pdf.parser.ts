import { MulterFile } from 'nestjs-busboy';
import { extractText, getDocumentProxy } from 'unpdf';
import { IDocParser } from './parser';

export class PdfParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    if (!file.buffer) {
      throw new Error('File does not appear to have a buffer');
    }

    const pdf = await getDocumentProxy(new Uint8Array(file.buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }
}
