import { MulterFile } from 'nestjs-busboy';
import { IDocParser } from './parser';

export class TxtParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    return '';
  }
}
