import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';

const userName = encodeURIComponent(process.env.MONGOUSERNAME);
const password = encodeURIComponent(process.env.MONGOPASSWORD);
const dbName = process.env.MONGODBNAME;

const uri = `mongodb+srv://${userName}:${password}@42race.k07nxqh.mongodb.net/?retryWrites=true&w=majority&appName=42race?directConnection=true`;

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export const checkConnection = async () => {
    try {
        await client.connect();
        await client.db(`${dbName}`).command({ ping: 1 });
        console.log('Mongo Server Successful Connected');
    } catch (err) {
        console.log(err)
        console.dir
    } finally {
        await client.close();
    }
};

export const clients = async (collection) => {
    try {
        await client.connect();
        const db = client.db(`${dbName}`);
        const myColl = db.collection(`${collection}`);
        return myColl;
    } catch (err) {
        return new Error(err);
    }
}
export const disconnect = async (collection) => {
    try {
        await client.close();
    } catch (err) {
        return new Error(err);
    }
}
