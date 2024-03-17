import { MongoClient, ServerApiVersion } from "mongodb";

const URI = process.env.ATLAS_URI || "";
const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
} catch (err) {
    console.error(err);
}

let db = client.db("ExpenseManagement");

export default db;