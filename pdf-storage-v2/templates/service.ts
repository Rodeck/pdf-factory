import { IField, ITemplate, ITemplateModel } from "./models";
import { containerName, getContainer } from "../commons/cosmos";
import { fetchFile } from "../commons/storage";
import { IPdfStructure } from "../commons/fileParser";

const putTemplate = async (data: {
    userId: string,
    template: IPdfStructure,
    blobName: string,
    fileName: string,
    templateName: string,
}) => {

    const container = getContainer();

    const fields = getFields(data.template);

    const { resource: createdItem } = await container.items.create({
        PK: templatePK(data.userId),
        Fields: fields,
        File: data.blobName,
        TemplateName: data.templateName,
        CreatedDate: new Date().toISOString(),
    });

    return createdItem;
}

const fetchTemplates = async (userId: string) => {

    const container = getContainer();

    const result = await container.items.readAll<ITemplate>({ partitionKey: templatePK(userId)}).fetchAll();

    return result.resources.map((element) => mapTemplate(element));   
}

const fetchTemplate = async (userId: string, templateId: string) => {
    const container = getContainer();

    const querySpec = {
        query: `select * from ${containerName} p where p.PK=@PK and p.id=@templateId`,
        parameters: [
            {
                name: "@PK",
                value: templatePK(userId)
            },
            {
                name: "@templateId",
                value: templateId
            }
        ]
    };

    const result = await container.items.query<ITemplate>(querySpec).fetchAll();

    return mapTemplate(result.resources[0]);
}

const fetchTemplateFile = async (userId: string, fileName: string) => {
    const file = await fetchFile(fileName);

    return file;
}

const templatePK = (userId: string) => `${userId}#template`;

const mapTemplate = (item: ITemplate) : ITemplateModel => {
    return {
        id: item.id,
        fields: item.Fields,
        name: item.TemplateName,
        fileName: item.File,
    }
}

const getFields = (template: IPdfStructure) : IField[] => {
    const fields: IField[] = [];

    template.pages.forEach((page, idx) => {
        page.Fields.forEach(field => {
            fields.push({
                id: {
                    id: field.id.Id,
                    EN: field.id.EN,
                },
                page: idx,
            });
        }
    )});

    return fields;
}

export { fetchTemplate, putTemplate, fetchTemplates, fetchTemplateFile };
