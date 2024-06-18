import { clients, disconnect } from "../config/mongodb.js";
import axios from 'axios';
import 'dotenv/config';
import { checkUser } from "./userController.js";



export const subscribeWebhook = async (req, res) => {
    try {
        const client_id = process.env.STRAVACLIENTID;
        const client_secret = process.env.STRAVASECRET;
        const verifyToken = 'STRAVA';
        const baseURL = process.env.BASEURL;
        const subscribe = await axios.post(`https://www.strava.com/api/v3/push_subscriptions?client_id=${client_id}&client_secret=${client_secret}&callback_url=${baseURL}/api/strava/webhook&verify_token=${verifyToken}`)
        return true;
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error connect to webhook' })
    }
};

export const supportWebhook = async (req, res) => {
    try {
        const VERIFY_TOKEN = "STRAVA";
        // Parses the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
            // Verifies that the mode and token sent are valid
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');

                res.status(200).json({ "hub.challenge": challenge });
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error connect to webhook' })
    }
}

export const webhook = async (req, res) => {
    try {
        console.log("webhook event received!", req.query, req.body);
        const mongoClient = await clients('Activity')
        const user = await checkUser(req.body.owner_id);

        //create new index for activityID to avoid duplicate
        const collectionIndex = await mongoClient.listIndexes().toArray();
        await collectionIndex.map(async index => {
            if (!index.key['activityid']) {
                await mongoClient.createIndex({ activityid: 1 }, { unique: true })
            } else {

            }
        })
        if (user.logedin) {
            //i cant fetch 3 days before on strava API, i already have the epoch time, but it not show anything
            const now = Math.floor(Date.now() / 1000);
            const threeDaysAgo = now - (3 * 24 * 60 * 60);
            const getActivity = await axios.get(`https://www.strava.com/api/v3/athlete/activities?&page=1&per_page=100`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            }).then(
                response => {
                    return response
                }
            );

            await getActivity.data.map(data => {
                data.athlete.username = user.username;
                data.client_id = user.client_id;
                data.activityid = data.id;
            })

            try {
                await mongoClient.insertMany(getActivity.data);
            } catch (err) {

            }

        }
        console.log('event recieved')
        res.status(200).send('EVENT_RECEIVED');
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error connect to webhook' })
    }
};

export const deleteWebhook = async (id) => {
    try {
        const client_id = process.env.STRAVACLIENTID;
        const client_secret = process.env.STRAVASECRET;
        return await axios.delete(`https://www.strava.com/api/v3/push_subscriptions/${id}?client_id=${client_id}&client_secret=${client_secret}`).then((response, error) => {
            if (error) {
                throw error
            }
            return { success: true }
        }
        );
    } catch (err) {
        console.log(err);
        return new Error(err);
    }
};

export const getExistingWebhook = async () => {
    try {
        const client_id = process.env.STRAVACLIENTID;
        const client_secret = process.env.STRAVASECRET;
        return await axios.get(`https://www.strava.com/api/v3/push_subscriptions?client_id=${client_id}&client_secret=${client_secret}`).then((response, error) => {
            if (error) {
                throw error
            }
            return { success: true, data: response.data[0] }
        }
        );
    } catch (err) {
        console.log(err);
        return new Error(err)
    }
};