import uuidv1 from "uuidv1";
import {BlobServiceClient} from '@azure/storage-blob';

import { DefaultAzureCredential } from '@azure/identity';

const storageAccount = "pdffactorystorage";
const containerName = "pdf-templates";

const blobServiceClient = new BlobServiceClient(
    `https://${storageAccount}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

const saveFile = async (file, fileName) => {
    const blobName = uuidv1() + fileName;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(file, file.length);

    return blobName;
}

const fetchFiles = async () => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobs = containerClient.listBlobsFlat();
    const files = [];
    for await (const blob of blobs) {
        files.push(blob.name);
    }
    return files;
}

const fetchFile = async (fileName) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blob = containerClient.getBlobClient(fileName);
    return await blob.downloadToBuffer();
}

export { saveFile, fetchFiles, fetchFile };
