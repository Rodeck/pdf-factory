import { fillData } from '../commons/fileParser';
import { IFieldMapping } from '../templates/models';
import { fetchTemplate, fetchTemplateFile } from '../templates/service';
import { fetchSetDataById } from '../data/service';
import { putFile } from '../commons/storage';
import { v4 as uuid } from 'uuid';

const generate = async (templateId: string, setId: string, mappings: Array<IFieldMapping>, userId: string) => {
    const template = await fetchTemplate(userId, templateId)

    if (!template) {
        throw new Error(`Template ${templateId} not found`);
    }

    const templateFile = await fetchTemplateFile(userId, template.fileName);

    const set = await fetchSetDataById(userId, setId);
    const generatedFiles = await fillData(templateFile, mappings, set.items);

    const files = generatedFiles.map(e => {
        return {
            file: e.file,
            row: e.row[set.set.idColumn],
        }
    });

    const response = [];
    for (const file of files) {
        const blobName = await putFile(`${uuid()}.pdf`, file.file);
        response.push({
            row: file.row,
            blobName: blobName,
        })
    }

    return response;
}

export { generate }