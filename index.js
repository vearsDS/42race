import express from 'express';
import corss from 'cors';
import mongodb from 'mongodb';
import node from 'http';
import bodyParser from 'body-parser';
import libRoutes from './lib/readFiles.js';
import path from 'path';
import { checkConnection as CheckConnectionMongo } from './config/mongodb.js'


const app = express();
const routes = libRoutes('./routes');


///enable form Data
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


//corss setting
app.use(corss());

//itterates and import through all routes
const arr = [];
let count = 0;
routes.forEach(async (file) => {
    const paths = path.parse(file).name;
    if (paths.includes(".")) return;
    let routepath = file.split(path.sep).slice(1, -1).join(path.sep);
    routepath = `/${routepath}/${path.parse(file).name}`;
    const { default: routeFile } = await import(`./${file}`);
    console.log(routepath)
    app.use(routepath, routeFile);
    count += 1;
    arr.push(routepath);
});

const PORT = process.env.PORT || 3000;
const server = node.createServer(app);

server.listen(PORT, async () => {
    try {
        await CheckConnectionMongo();
        console.log(`Server listening on ${PORT}`);

    } catch (err) {
        console.log(err);
    }
});