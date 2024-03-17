import express from 'express';
import db from '../db/connection.js';

const monthlyExpensesRouter = express.Router();

monthlyExpensesRouter.get("/", async (req, res) => {
    let collection = db.collection("monthly-expenses");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

export default monthlyExpensesRouter;