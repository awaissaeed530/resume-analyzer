import { MulterFile } from 'nestjs-busboy';
import { IDocParser } from './parser';

export class DocxParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    return '';
  }
}
