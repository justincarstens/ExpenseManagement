// nodemon server.js to start live server <3

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import accountsRouter from './routes/accountsRoutes.js';
import transactionsRouter from './routes/transactionsRoutes.js';
import monthlyExpensesRouter from './routes/monthlyExpensesRoutes.js';
import budgetAccountsRouter from './routes/budgetAccountsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/accounts', accountsRouter);
app.use('/transactions', transactionsRouter);
app.use('/monthly-expenses', monthlyExpensesRouter);
app.use('/budgetAccounts', budgetAccountsRouter);

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
