import { MulterFile } from 'nestjs-busboy';
import { OfficeParser } from 'officeparser';
import { InvalidFileError, ParserError } from '../error';
import { IDocParser } from './parser';

export class DocxParser implements IDocParser {
  async parse(file: MulterFile): Promise<string> {
    if (!file.buffer) {
      throw new InvalidFileError('File does not appear to have a buffer');
    }

    try {
      const ast = await OfficeParser.parseOffice(new Uint8Array(file.buffer), {
        extractAttachments: true,
        ocr: true,
      });

      const text = await ast.to('text');
      return text.value;
    } catch (error) {
      throw new ParserError('Failed to parse DOCX file', error);
    }
  }
}
