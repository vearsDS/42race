import express from 'express';
import corss from 'cors';
import node from 'http';
import bodyParser from 'body-parser';
import libRoutes from './lib/readFiles.js';
import path from 'path';
import { checkConnection as CheckConnectionMongo } from './config/mongodb.js';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { WebSocketServer } from 'ws';
import cookieParser from 'cookie-parser';

const app = express();
const routes = libRoutes('./routes');

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(corss({ origin: '*' }));
app.use(cookieParser());

//TODO : add main pages routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'assets')));

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
export const wss = new WebSocketServer({ server });


server.listen(PORT, async () => {
    try {
        await CheckConnectionMongo();
        console.log(`Server listening on ${PORT}`);

    } catch (err) {
        console.log(err);
    }
});