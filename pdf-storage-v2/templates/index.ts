import express, { Request, Response } from 'express';
import { fetchTemplate, fetchTemplateFile, fetchTemplates, putTemplate } from './service';
import { getUser } from '../commons/auth';
import { putFile } from '../commons/storage';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { parseFile } from '../commons/fileParser';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const result = await fetchTemplates(getUser(req));
    res.send(result);
  });
  
router.get('/:templateId', async (req: Request<{templateId: string}>, res: Response) => {
    const result = await fetchTemplate(getUser(req), req.params.templateId);
    res.send(result);
});

router.get('/:templateId/file/:fileName', async (req: Request<{templateId: string, fileName: string}>, res: Response) => {
    const result = await fetchTemplateFile(getUser(req), req.params.fileName);
    res.send(result);
});

router.post('/', fileUpload(), async (req: Request<{}, {}, {templateName: string}>, res: Response) => {
    const file = req.files!.pdfFile as UploadedFile;
    const fileName = await putFile(file.name, file.data);
    const template = await parseFile(file.data, async template => {
        const result = await putTemplate({
            blobName: fileName,
            templateName: req.body.templateName,
            userId: getUser(req),
            fileName: file.name,
            template: template,
        });
        res.send(result);
    });
});

const templatesRouter = router;

export { templatesRouter }