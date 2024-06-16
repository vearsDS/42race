import { MongoClient, ServerApiVersion } from "mongodb";

const userName = encodeURIComponent(process.env.MONGOUSERNAME || "andreasgustaviano");
const password = encodeURIComponent(process.env.MONGOPASSWORD || 'TL7ILDN4NSsnzzcx');
const dbName = process.env.MONGODBNAME || '42race';
const authMechanism = 'SCRAM-SHA-256';
const uri = `mongodb+srv://${userName}:${password}@42race.k07nxqh.mongodb.net/?retryWrites=true&w=majority&appName=42race`;

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
        await client.db('42race').command({ ping: 1 });
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
        const db = client.db('42race');
        const myColl = db.collection(`${collection}`);
        return myColl;
    } catch (err) {
        return new Error(err);
    }
}
