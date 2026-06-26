import { MulterFile } from 'nestjs-busboy';
import { DocxParser } from './docx.parser';
import { TxtParser } from './txt.parser';
import { PdfParser } from './pdf.parser';

export enum DocType {
  Docx = 'docx',
  Txt = 'txt',
  Pdf = 'pdf',
}

/** Retrieve {@link DocType} for given MIME type */
export function docTypeFromMime(mime: string): DocType {
  switch (mime) {
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return DocType.Docx;
    case 'text/plain':
      return DocType.Txt;
    case 'application/pdf':
      return DocType.Pdf;
    default:
      throw new Error(`Unsupported mime type: ${mime}`);
  }
}

export interface IDocParser {
  parse(file: MulterFile): Promise<string>;
}

/** Returns appropriate {@link IDocParser} for given {@link DocType} */
export function getParser(docType: DocType): IDocParser {
  switch (docType) {
    case DocType.Pdf:
      return new PdfParser();
    case DocType.Docx:
      return new DocxParser();
    case DocType.Txt:
      return new TxtParser();
    default:
      throw new Error(`Unsupported file type: ${docType}`);
  }
}
