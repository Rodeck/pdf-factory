import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";


const containerName = `templates`;
const databaseName = `pdfTemplates`;

const getContainer = () => {

    if (process.env.COSMOS_ENDPOINT === undefined) throw new Error("COSMOS_ENDPOINT is not defined");

    const endpoint = process.env.COSMOS_ENDPOINT!;
    const cosmosClient = new CosmosClient({ 
        endpoint, 
        aadCredentials: new DefaultAzureCredential() 
    });

    const database = cosmosClient.database(databaseName);
    return database.container(containerName);
}

export { getContainer, containerName };
