import express from 'express';
import db from '../db/connection.js';

const transactionsRouter = express.Router();

transactionsRouter.get("/", async (req, res) => {
    let collection = await db.collection("transactions");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

transactionsRouter.post("/", async (req, res) => {
    try {

        let newDocument = {
            name: req.body.name,
            account: req.body.account,
            amount: req.body.amount,
            split: req.body.split,
            owner: req.body.owner,
            preplannedExpense: req.body.preplannedExpense
        };

        let collection = db.collection("transactions");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record - FAILED ON ROUTER");
    }
});

export default transactionsRouter;