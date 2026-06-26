import { MulterFile } from 'nestjs-busboy';
import { readFile } from 'node:fs/promises';
import { InvalidFileError, ParserError } from '../error';
import { IDocParser } from './parser';

export class TxtParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    if (!file.path) {
      throw new InvalidFileError('File does not appear to have a path');
    }

    try {
      return readFile(file.path, 'utf8');
    } catch (error) {
      throw new ParserError('Failed to parse TXT file', error);
    }
  }
}
