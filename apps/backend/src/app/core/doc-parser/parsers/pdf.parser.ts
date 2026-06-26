import { MulterFile } from 'nestjs-busboy';
import { IDocParser } from './parser';

export class PdfParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    return '';
  }
}
