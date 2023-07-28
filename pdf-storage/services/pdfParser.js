import PDFParser from "pdf2json";
import fs from "fs";
import { saveFile } from "./storageService.js";
import { putTemplate } from './dbStorage.js'

const parsePdf = async (data, callback) => {
    // save file
    try
    {
        fs.writeFileSync("./F1040EZ.pdf", data.file.data);
        
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", async pdfData => {
            var fields = JSON.stringify(pdfParser.getAllFieldsTypes());
     
            //callback(fields);
            let blobName = await saveFile(data.file.data, data.file.name);
            await putTemplate(data.userId, fields, blobName, data.file.name, data.templateName);

            callback({
                template: fields,
                fileName: blobName
            });
        });

        pdfParser.loadPDF("./F1040EZ.pdf");   
    }
    catch (err)
    {
        console.log(err);
    }
}
export default parsePdf;