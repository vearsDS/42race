import express from 'express';
import { initUser, getStraveAPI as tokenExchange, initStrava as authorizeStrave, getUserUri, deauthorize, getUserListAccounts } from "../../controller/userController.js"
import { auth } from '../../lib/auth.js';
const router = express.Router();

//connect endpoint
router.get('/connect', async (req, res) => await authorizeStrave(req, res));

//Disonnect enpoint
router.post('/disconnect', auth, async (req, res) => await deauthorize(req, res));

//authorized Endpoint
router.get('/apiexchange', async (req, res) => await tokenExchange(req, res));

//init User to check if the user already exists (loggedin or not)
router.get('/inituser', auth, async (req, res) => await initUser(req, res));

//Account endpoint
router.get('/getUserAccount', auth, async (req, res) => await getUserUri(req, res));

//Accounts endpoint
router.get('/getListAccounts', auth, async (req, res) => await getUserListAccounts(req, res))



export default router;