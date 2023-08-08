import express, { Request, Response } from 'express';
import { generate } from './service';
import { getUser } from '../commons/auth';
import { IFieldMapping } from '../templates/models';
import bodyParser from 'body-parser';
import { fetchFile } from '../commons/storage';

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (req: Request<{}, {}, any>, res: Response) => {
    const result = await generate(req.body.templateId, req.body.set, req.body.fieldAssignments, getUser(req));
    res.send(result);
});

router.get('/:file', async (req: Request, res: Response) => {
    const file = await fetchFile(req.params.file);

    res.send(file);
});

const generatorRouter = router;

export { generatorRouter }