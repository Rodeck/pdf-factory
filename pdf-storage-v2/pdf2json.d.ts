
declare class PDFParser
{
    constructor();
    on(event: string, callback: (data: string) => void): void;
    parseBuffer(buffer: Buffer): void;
}

declare module 'pdf2json' {
    export = PDFParser;
}