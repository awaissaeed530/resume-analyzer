import { Injectable } from '@nestjs/common';
import { MulterFile } from 'nestjs-busboy';
import { docTypeFromMime, getParser } from './parsers';

@Injectable()
export class DocParserService {
  async parseDocument(file: MulterFile): Promise<string> {
    const docType = docTypeFromMime(file.mimetype);
    const parser = getParser(docType);
    return parser.parse(file);
  }
}
