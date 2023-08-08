import express, { Request, Response } from 'express';
import { putData, fetchSetDataByName, fetchSets } from './service';
import { getUser } from '../commons/auth';
import { IDataInput } from './models';
import * as bodyParser from 'body-parser';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', async (req: Request, res: Response) => {
    const result = await fetchSets(getUser(req));
    res.send(result);
  });
  
router.get('/:setName', async (req: Request<{setName: string}>, res: Response) => {
    const result = await fetchSetDataByName(getUser(req), req.params.setName);
    res.send(result);
});

router.post('/', jsonParser, async (req: Request<{}, {}, IDataInput>, res: Response) => {
    const result = await putData(getUser(req), req.body);
    res.send(result);
});

const dataRouter = router;

export { dataRouter }