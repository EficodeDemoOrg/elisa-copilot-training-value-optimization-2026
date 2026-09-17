import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { boardRouter } from './routes/board.js';
import { columnsRouter } from './routes/columns.js';
import { cardsRouter } from './routes/cards.js';
import { labelsRouter } from './routes/labels.js';

const app = express();
const PORT = Number(process.env.API_PORT ?? 5891);

app.use(cors());
app.use(express.json());

app.use('/api/board', boardRouter);
app.use('/api/columns', columnsRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/labels', labelsRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request body', code: 'VALIDATION', issues: err.issues });
        return;
    }
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = err?.message ?? 'Internal error';
    res.status(status).json({ error: message, code: err?.code });
};
app.use(errorHandler);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[kanban] API listening on http://localhost:${PORT}`);
});
