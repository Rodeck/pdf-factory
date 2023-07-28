
export interface ITemplate {
    id: string,
    Fields: IField[],
    TemplateName: string,
    File: string,
    CreatedDate: Date
}

export interface ITemplateModel {
    id: string;
    fields: IField[];
    name: string;
    fileName: string;
}

export interface IField {
    id: {id: string, EN: string}
    page: number;
}