import express from 'express';
import { getStraveAPI, postData } from "../../controller/stravaController.js"
const router = express.Router();

router.get('/apiexchange', async (req, res) => await getStraveAPI(req, res));


export default router;