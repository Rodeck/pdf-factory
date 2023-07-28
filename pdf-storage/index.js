import dotenv from 'dotenv';
let result = dotenv.config();

if (result.error) {
    throw result.error;
}

import express from 'express';
import fileUpload from 'express-fileupload';
import parsePdf from './services/pdfParser.js';
import getTemplates from './services/templateFiles.js';
import { fetchFile } from './services/storageService.js'
import { putDataSet, fetchDataSets, fetchData, fetchTemplate } from './services/dbStorage.js';
import cors from 'cors';

const app = express();
const PORT = process.env.port || 3030;

const UserId = "user1234";

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));

app.post('/upload', async function(req, res) {
    const data = {
        file: req.files.pdfFile,
        templateName: req.body.templateName,
        userId: UserId,
    }
    console.log(req.files.pdfFile); // the uploaded file object
    parsePdf(data, file => res.send(file));
});

app.get('/templates', async function(req, res) {
    let userId = UserId;
    var files = await getTemplates(userId);

    res.send(files);
});

app.get('/template', async function(req, res) {
    let userId = UserId;
    var data = await fetchTemplate(userId, req.query.templateId);

    res.send(data)
});

app.get('/template/file', async function(req, res) {
    let userId = UserId;
    
    const file = await fetchFile(req.query.file);

    const fileType = 'application/pdf'

    res.writeHead(200, {
      'Content-Type': fileType,
    })

    res.end(file);
});

app.post('/data', async function(req, res) {
    let userId = UserId;
    await putDataSet(userId, req.body.data, req.body.rowIdColumn, req.body.columns, req.body.dataSetName);

    res.send("ok");
});

app.get('/dataSets', async function(req, res) {
    let userId = UserId;
    res.send(await fetchDataSets(userId));
});

app.get('/data', async function(req, res) {
    let userId = UserId;
    res.send(await fetchData(userId, req.query.dataSetName));
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);