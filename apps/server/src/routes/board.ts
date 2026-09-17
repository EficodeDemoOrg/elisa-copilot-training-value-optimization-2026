import { Router } from 'express';
import { db } from '../db.js';

export const boardRouter = Router();

boardRouter.get('/', (_req, res) => {
    res.json(db.data.board);
});
