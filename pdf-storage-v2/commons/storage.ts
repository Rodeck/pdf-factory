import { v4 as uuid } from 'uuid';
import {BlobServiceClient} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

const storageAccount = "pdffactorystorage";
const containerName = "pdf-templates";

const blobServiceClient = new BlobServiceClient(
    `https://${storageAccount}.blob.core.windows.net`,
    new DefaultAzureCredential()
);

const fetchFile = async (fileName: string) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blob = containerClient.getBlobClient(fileName);
    return await blob.downloadToBuffer();
}

const putFile = async (fileName: string, file: Buffer) => {
    const blobName = uuid() + fileName;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blob = containerClient.getBlockBlobClient(blobName);
    await blob.upload(file, file.length);

    return blobName;
}

export { fetchFile, putFile };
