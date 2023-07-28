import express, { Express, Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Serverr');
  });
  
router.get('/error', (req: Request, res: Response) => {
    throw new Error('Error!');
});

router.get('/errorWithCode', (req: Request, res: Response) => {
    res.status(400);
    throw new Error('Error!');
});

export default router;