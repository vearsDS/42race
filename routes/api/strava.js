import express from 'express';
import { supportWebhook, webhook, subscribeWebhook } from "../../controller/stravaController.js"
import { auth } from '../../lib/auth.js';
const router = express.Router();



//support for the webhook
router.get('/webhook', async (req, res) => await supportWebhook(req, res));

//subscribe webhook endpoint
router.post('/subscribewebhook', auth, async (req, res) => await subscribeWebhook(req, res));

//webhook endpoint
router.post('/webhook', async (req, res) => await webhook(req, res));




export default router;