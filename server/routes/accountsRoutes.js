import express from "express";
import db from "../db/connection.js";

const accountsRouter = express.Router();
// accountsRouter is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /accounts.
// 'Router' classes are to define API endpoints - REMEMBER to define them on server.js as well!!

// GET ALL RECORDS IN ACCOUNT - GET /accounts
accountsRouter.get("/", async (req, res) => {
    let collection = db.collection("accounts");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

export default accountsRouter;