import express from "express";
import db from "../db/connection.js";

const budgetAccountsRouter = express.Router();

budgetAccountsRouter.get("/", async (req, res) => {
    let collection = db.collection("budgetAccounts");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

export default budgetAccountsRouter;