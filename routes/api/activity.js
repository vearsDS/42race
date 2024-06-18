import express from 'express';
import { deleteActivity, fetchActivities, fetchActivity } from "../../controller/activityController.js"
import { auth } from '../../lib/auth.js';
const router = express.Router();

router.get('/getActivities', auth, async (req, res) => await fetchActivities(req, res));
router.get('/getActivity/:id', auth, async (req, res) => await fetchActivity(req, res));
router.delete('/:id', auth, async (req, res) => await deleteActivity(req, res));






export default router;