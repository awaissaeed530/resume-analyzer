import { MulterFile } from 'nestjs-busboy';
import { extractText, getDocumentProxy } from 'unpdf';
import { IDocParser } from './parser';
import { InvalidFileError, ParserError } from '../error';

export class PdfParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    if (!file.buffer) {
      throw new InvalidFileError('File does not appear to have a buffer');
    }

    try {
      const pdf = await getDocumentProxy(new Uint8Array(file.buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      return text;
    } catch (error) {
      throw new ParserError('Failed to parse PDF file', error);
    }
  }
}
