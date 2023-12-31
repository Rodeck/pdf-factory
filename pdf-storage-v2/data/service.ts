import { IData, IDataInput, IDataModel, IDataSet, IDataSetModel, IDataSetWithData } from "./models";
import { containerName, getContainer } from "../commons/cosmos";

const putData = async (userId: string, input: IDataInput) => {

    const container = getContainer();

    input.data.forEach(async (element) => {
        const { resource: createdItem } = await container.items.create<IData>({
            PK: dataPk(userId),
            Data: convertToObject(element, input.columns),
            CreatedDate: new Date(),
            DataSetName: input.dataSetName,
        });
    });

    const { resource: createdSet } = await container.items.create<IDataSet>({
        PK: dataSetPk(userId),
        CreatedDate: new Date(),
        Name: input.dataSetName,
        Columns: input.columns,
        DataCount: input.data.length,
        id: undefined,
        IdColumn: input.rowId,
    });

    return createdSet?.id;
}

const fetchSets = async (userId: string) => {

    const container = getContainer();

    const result = await container.items.readAll<IDataSet>({ partitionKey: dataSetPk(userId)}).fetchAll();

    return result.resources.map((element) => mapDataSet(element));   
}

const fetchSetDataByName = async (userId: string, setName: string) : Promise<IDataSetWithData> => {
    const set = await fetchSetByName(userId, setName);

    return await fetchSetData(userId, set)

}

const fetchSetDataById = async (userId: string, setId: string) : Promise<IDataSetWithData> => {
    const set = await fetchSetById(userId, setId);

    return await fetchSetData(userId, set)

}

const fetchSetData = async (userId: string, set: IDataSet) : Promise<IDataSetWithData> => {
    
    const container = getContainer();
    const dataSet = mapDataSet(set);

    const dataQuery = {
        query: `select * from ${containerName} p where p.PK=@PK and p.DataSetName=@dataSetName`,
        parameters: [
            {
                name: "@PK",
                value: dataPk(userId)
            },
            {
                name: "@dataSetName",
                value: set.Name
            }
        ]
    };

    const dataResult = await container.items.query<IData>(dataQuery).fetchAll();
    const data = dataResult.resources.map((element) => mapRawData(element));

    return {
        set: dataSet,
        items: data,
    }
}


const fetchSetByName = async (userId: string, setName: string) : Promise<IDataSet> => {
    const container = getContainer();

    const querySpec = {
        query: `select * from ${containerName} p where p.PK=@PK and p.Name=@dataSetName`,
        parameters: [
            {
                name: "@PK",
                value: dataSetPk(userId)
            },
            {
                name: "@dataSetName",
                value: setName
            }
        ]
    };


    const result = await container.items.query<IDataSet>(querySpec).fetchAll();

    return result.resources[0];

}

const fetchSetById = async (userId: string, setId: string) : Promise<IDataSet> => {
    const container = getContainer();

    const querySpec = {
        query: `select * from ${containerName} p where p.PK=@PK and p.id=@id`,
        parameters: [
            {
                name: "@PK",
                value: dataSetPk(userId)
            },
            {
                name: "@id",
                value: setId
            }
        ]
    };


    const result = await container.items.query<IDataSet>(querySpec).fetchAll();

    return result.resources[0];

}

const dataPk = (userId: string) => `${userId}#data`;
const dataSetPk = (userId: string) => `${userId}#dataSet`;

const mapDataSet = (item: IDataSet) : IDataSetModel => {
    return {
        id: item.id!,
        name: item.Name,
        createdDate: new Date(item.CreatedDate),
        itemsCount: item.DataCount,
        idColumn: item.IdColumn,
        columns: item.Columns,
    }
}

const mapData = (item: IData) : IDataModel => {
    return {
        data: item.Data,
        createdDate: new Date(item.CreatedDate),
    }
}

const mapRawData = (item: IData) : any => {
    return item.Data;
}

const convertToObject = (element: Array<string>, columns: Array<string>) => {
    const obj = {};

    columns.forEach((column, idx) => {
        Object.assign(obj, { [column]: element[idx] });
    });

    return obj;
}


export { putData, fetchSetDataByName, fetchSetDataById, fetchSets };
