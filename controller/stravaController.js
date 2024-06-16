import { client, clients } from "../config/mongodb.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getStraveAPI = async (req, res) => {
    try {
        // res.writeHeader(200, { "Content-Type": "text/html" });
        console.log(__dirname)
        res.sendFile(path.join(__dirname, '/index.html'));
    } catch (err) {
        return res.status(200).json({ success: true, message: "router doesn't works" })
    } finally {
        console.log('done')
    }
};


export const postData = async (req, res) => {
    try {
        // const a = await clients();
        // const collection = a.collection('test');
        // const doc = { name: 'aha', class: 'statistics' };
        const body = req.body;
        console.log(body)
        const clientss = await clients('test');
        await clientss.insertOne(body).then(data => {
            return res.status(200).json({ success: true, message: data })
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    } finally {
    }
};

export const getData = async (req, res) => {
    try {
        const a = await clients('test');

    } catch (err) {
        return res.status(200).json({ success: false, message: err.message })
    }
}