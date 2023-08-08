export interface IDataSet {
    id: string | undefined,
    Name: string,
    DataCount: number,
    CreatedDate: Date,
    Columns: string[],
    PK: string,
    IdColumn: string,
}

export interface IDataSetModel {
    id: string,
    name: string,
    createdDate: Date,
    itemsCount: number,
    idColumn: string,
    columns: string[],
}

export interface IDataSetWithData {
    set: IDataSetModel,
    items: any[],
}

export interface IDataInput {
    columns: string[],
    data: string[][],
    rowId: string,
    dataSetName: string,
}

export interface IData {
    PK: string,
    Data: any,
    CreatedDate: Date,
    DataSetName: string,
}

export interface IDataModel {
    data: any,
    createdDate: Date,
}