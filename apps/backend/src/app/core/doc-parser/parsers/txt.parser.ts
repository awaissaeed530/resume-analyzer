import { MulterFile } from 'nestjs-busboy';
import { readFile } from 'node:fs/promises';
import { IDocParser } from './parser';

export class TxtParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    if (!file.path) {
      throw new Error('File does not appear to have a path');
    }

    return readFile(file.path, 'utf8');
  }
}
