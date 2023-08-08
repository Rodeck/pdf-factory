import PDFParser from "pdf2json";
import { PDFDocument } from 'pdf-lib'
import { IField, IFieldMapping } from "../templates/models";

const parseFile = async (file: Buffer, callback: (data: IPdfStructure) => void) => {

    const bufferFile = Buffer.from(file);
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => console.error(errData) );
    pdfParser.on("pdfParser_dataReady", (pdfData : any) => {
        callback(convert(pdfData));
    });

    pdfParser.parseBuffer(bufferFile);
}

const convert = (pdfData: any) : IPdfStructure => {
    return {
        pages: pdfData.Pages.map((page: any) => {
            return {
                Width: page.Width,
                Height: page.Height,
                HLines: page.HLines,
                VLines: page.VLines,
                Fills: page.Fills,
                Texts: page.Texts,
                Fields: page.Fields,
                Boxsets: page.Boxsets,
            }
        }),
        meta: {
            PDFFormatVersion: pdfData.Meta.PDFFormatVersion,
            IsAcroFormPresent: pdfData.Meta.IsAcroFormPresent,
            IsXFAPresent: pdfData.Meta.IsXFAPresent,
            Title: pdfData.Meta.Title,
            Author: pdfData.Meta.Author,
            Subject: pdfData.Meta.Subject,
            Keywords: pdfData.Meta.Keywords,
            Creator: pdfData.Meta.Creator,
            Producer: pdfData.Meta.Producer,
            CreationDate: pdfData.Meta.CreationDate,
            ModDate: pdfData.Meta.ModDate,
        }
    }
}

const fillData = async (templateFile: Buffer, fields: IFieldMapping[], data: Array<any>) : Promise<Array<{file: Buffer, row: any}>>=> {
    const result = new Array<{file: Buffer, row: any}>;
    
    for (const row of data) {
        const pdfDoc = await PDFDocument.load(templateFile);
        const form = pdfDoc.getForm();

        fields.forEach((field) => {
            const formField = form.getTextField(field.fieldId);
            formField.setText(row[field.column]);
        });

        let doc = await pdfDoc.save();
        result.push({
            file: toBuffer(doc),
            row: row,
        });
    }

    return result;
}

const toBuffer = (arrayBuffer: Uint8Array) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
}


export interface IPdfStructure {
    pages: Array<IPage>,
    meta: IMeta,
}

export interface IPage {
    Width: Number,
    Height: Number,
    HLines: Array<any>,
    VLines: Array<any>,
    Fills: Array<any>,
    Texts: Array<any>,
    Fields: Array<any>,
    Boxsets: Array<any>
}

export interface IMeta {
    PDFFormatVersion: '1.5',
    IsAcroFormPresent: Boolean,
    IsXFAPresent: Boolean,
    Title: string,
    Author: string,
    Subject: string,
    Keywords: string,
    Creator: string,
    Producer: string,
    CreationDate: string,
    ModDate: string,
}

export { parseFile, fillData }