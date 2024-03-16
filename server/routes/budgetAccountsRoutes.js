import express from "express";
import db from "../db/connection.js";

const budgetAccountsRouter = express.Router();

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /accounts.

// GET ALL RECORDS IN ACCOUNT - GET http://localhost:3000/accounts
budgetAccountsRouter.get("/", async (req, res) => {
    let collection = await db.collection("budgetAccounts");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

export default budgetAccountsRouter;