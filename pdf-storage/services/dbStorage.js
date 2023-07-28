import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from '@azure/identity';

const databaseName = `pdfTemplates`;
const containerName = `templates`;

const putTemplate = async (userId, template, blobName, fileName, templateName) => {

    const container = getContainer();

    const { resource: createdItem } = await container.items.create({
        PK: templatePK(userId),
        JsonString: template,
        File: blobName,
        TemplateName: templateName,
        CreatedDate: new Date().toISOString(),
    });

    return createdItem;
}

const fetchTemplates = async (userId) => {

    const container = getContainer();

    const result = await container.items.readAll({ partitionKey: templatePK(userId)}).fetchAll();

    return mapItems(result.resources);     
}

const fetchTemplate = async (userId, templateId) => {
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

    const result = await container.items.query(querySpec).fetchAll();

    return mapTemplate(result.resources[0]);
}

const mapTemplate = (item) => {
    return {
        json: item.JsonString,
        name: item.TemplateName,
        file: item.File,
    }
}

const mapItems = (items) => {

    return items.map(item => {
        return {
            id: item.id,
            template: item.JsonString,
            fileName: item.File,
            templateName: item.TemplateName,
            createdDate: item.CreatedDate
        }
    });
}

const putDataSet = async (userId, data, rowId, columns, dataSetName) => {
    const container = getContainer();

    data.forEach(async element => {
        const { resource: createdItem } = await container.items.create({
            PK: dataPk(userId),
            RowId: element[rowId],
            Data: convertToObject(element, columns),
            DataSetName: dataSetName,
            CreatedDate: new Date().toISOString(),
        });    
    });

    const { resource: createdItem } = await container.items.create({
        PK: dataSetPk(userId),
        DataSetName: dataSetName,
        Count: data.length,
        CreatedDate: new Date().toISOString(),
        Columns: columns,
    });
}

const convertToObject = (element, columns) => {
    const obj = {};

    columns.forEach((column, idx) => {
        obj[column] = element[idx];
    });

    return obj;
}

const fetchData = async (userId, dataSet) => {

    const container = getContainer();

    const querySpec = {
        query: `select * from ${containerName} p where p.PK=@PK and p.DataSetName=@dataSetName`,
        parameters: [
            {
                name: "@PK",
                value: dataPk(userId)
            },
            {
                name: "@dataSetName",
                value: dataSet
            }
        ]
    };

    const result = await container.items.query(querySpec).fetchAll();
    const set = await getSet(container, userId, dataSet);

    return {
        data: mapDataItems(result.resources),
        columns: set.Columns,
    };    
}

const getSet = async (container, userId, dataSet) => {
    const querySpec = {
        query: `select * from ${containerName} p where p.PK=@PK and p.DataSetName=@dataSetName`,
        parameters: [
            {
                name: "@PK",
                value: dataSetPk(userId)
            },
            {
                name: "@dataSetName",
                value: dataSet
            }
        ]
    };

    const result = await container.items.query(querySpec).fetchAll();

    return result.resources[0];
}

const fetchDataSets = async (userId) => {
    const container = getContainer();

    const result = await container.items.readAll({ partitionKey: dataSetPk(userId)}).fetchAll();

    return mapDataSets(result.resources);    
}

const mapDataItems = (items) => {
    return items.map(i => i.Data);
}

const mapDataSets = (items) => {
    return items.map(item => {
        return {
            id: item.id,
            name: item.DataSetName,
            createdDate: item.CreatedDate,
            itemsCount: item.Count,
        }
    });
}

const dataPk = (userId) => `${userId}#data`;
const dataSetPk = (userId) => `${userId}#dataSet`;
const templatePK = (userId) => `${userId}#template`;

export { putTemplate, fetchTemplates, fetchData, putDataSet, fetchDataSets, fetchTemplate };

const getContainer = () => {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const cosmosClient = new CosmosClient({ 
        endpoint, 
        aadCredentials: new DefaultAzureCredential() 
    });

    const database = cosmosClient.database(databaseName);
    return database.container(containerName);
}