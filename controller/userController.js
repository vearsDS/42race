import { clients, disconnect } from "../config/mongodb.js";
import axios from 'axios';
import 'dotenv/config';
import { deleteWebhook, getExistingWebhook, subscribeWebhook } from "./stravaController.js";

export const checkUser = async (athleteid) => {
    try {
        const mongoClient = await clients('Accounts');
        return await mongoClient.findOne({ athleteid: parseInt(athleteid) }).then(async data => {
            if (!data) {
                throw { code: 401, message: 'No User Found' }
            }
            if (data.expires_at < (Math.floor(Date.now() / 1000))) {
                return await getRefreshToken(user.client_id, client_secret, user.refresh_token)
            }
            return data
        })
    } catch (err) {
        throw err;
    }
}
export const initUser = async (req, res) => {
    try {
        const client_secret = process.env.STRAVASECRET;
        const athleteid = req.cookies.athleteid
        return await checkUser(athleteid).then(async user => {
            let newUser;
            if (user.logedin) {
                if (user.expires_at < (Date.now() / 1000)) {
                    newUser = await getRefreshToken(user.client_id, client_secret, user.refresh_token);
                } else {
                    newUser = user
                }
                const checkWebhook = await getExistingWebhook();
                if (checkWebhook.data) {
                    await deleteWebhook(checkWebhook.data.id)
                    await subscribeWebhook();
                } else {
                    await subscribeWebhook()
                }
            } else {
                throw { code: 401, message: 'UnAuthorized' }
            }
            return res.status(200).json({ success: true, data: newUser });
        });
    } catch (err) {
        console.log(err)
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message })
    } finally {
    }
};

export const initStrava = async (req, res) => {
    try {
        const client_id = process.env.STRAVACLIENTID;
        const baseURL = process.env.BASEURL
        const uri = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${baseURL}/api/account/apiexchange&approval_prompt=force&scope=read,activity:write,activity:read`
        return res.redirect(uri)
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    } finally {
    }
};

export const getStraveAPI = async (req, res) => {
    try {
        const { code } = req.query;
        if (req.query.error) {
            throw { message: req.query.error, code: 401 }
        }
        const client_id = process.env.STRAVACLIENTID;
        const client_secret = process.env.STRAVASECRET;
        const mongoClient = await clients('Accounts');
        let refresh_token, access_token, expires_at, expires_in, username, athleteid;




        // TODO: this should fetch strava token exchange API
        const requesStravToken = await axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`);
        refresh_token = requesStravToken.data.refresh_token;
        access_token = requesStravToken.data.access_token;
        expires_in = requesStravToken.data.expires_in;
        expires_at = requesStravToken.data.expires_at;
        athleteid = requesStravToken.data.athlete.id;
        username = requesStravToken.data.athlete.username;
        const existingClientId = await mongoClient.findOne({ athleteid: parseInt(athleteid) }, (err, result) => {
            if (err) {
                throw err;
            };
            return result;
        });
        //TODO : Update user To Sytem
        if (existingClientId) {
            if (!existingClientId.loggedin) {
                if (expires_at < Date.now() / 1000) {
                    await getRefreshToken(client_id, client_secret, refresh_token)
                } else {
                    await mongoClient.findOneAndUpdate({ athleteid: parseInt(athleteid) }, {
                        $set: {
                            athleteid,
                            username,
                            client_id,
                            refresh_token,
                            access_token,
                            expires_at,
                            expires_in,
                            logedin: true
                        }
                    }, { upsert: true, returnDocument: "after", returnNewDocument: true }).then((result, err) => {
                        if (err) {
                            console.log(err)
                        };
                    });
                }
            }
        } else {
            // TODO : Register User to system
            if (expires_at < Date.now() / 1000) {
                await getRefreshToken(client_id, client_secret, refresh_token)
            } else {
                await mongoClient.insertOne({
                    athleteid,
                    username,
                    client_id,
                    refresh_token,
                    access_token,
                    expires_at,
                    expires_in,
                    logedin: true
                });
            }
        }
        res.cookie('athleteid', athleteid, { httpOnly: true })
        res.cookie('access_token', access_token, { httpOnly: true })
        res.redirect('/');
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: true, message: err.message ? err.message : 'Error Exchange Token' })
    } finally {
        await disconnect();
    }
};

export const deauthorize = async (req, res) => {
    try {
        // const user = await checkUser();
        const mongoClient = await clients('Accounts');
        if (!req.cookies.access_token) {
            throw { code: 401, message: 'Please Provide your Access Token On Cookie' }
        }
        const requesStravToken = await axios.post(`https://www.strava.com/oauth/deauthorize?access_token=${req.cookies.access_token}`);
        return await mongoClient.findOneAndUpdate({ athleteid: parseInt(req.cookies.athleteid) }, {
            $set: {
                logedin: false
            }
        }, { upsert: true, returnDocument: "after", returnNewDocument: true }).then((result, err) => {
            if (err) {
                console.log(err)
                throw err;
            };
            res.clearCookie('athleteid');
            res.clearCookie('access_token');
            return res.redirect('/')
        });
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error fetch Account' })
    }
}

export const getUserUri = async (req, res) => {
    try {
        const athleteid = req.cookies.athleteid;
        return res.status(200).json({ success: true, data: `https://strava.com/athletes/${athleteid}` });
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: true, message: err.message ? err.message : 'Error fetch Account' })
    }
};

export const getUserListAccounts = async (req, res) => {
    try {
        const mongoClient = await clients('Accounts');

        const listOfAccounts = await mongoClient.find({}, {
            projection: {
                _id: 0, refresh_token: 0, access_token: 0, expires_in: 0, expires_at: 0
            }
        }).toArray();

        return res.status(200).json({ success: true, data: listOfAccounts });
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: true, message: err.message ? err.message : 'Error get activity' })
    }
}

export const getRefreshToken = async (client_id, client_secret, refresh_token) => {
    try {
        const mongoClient = await clients('Accounts');
        const filter = { athleteid };
        const options = { upsert: true, returnDocument: "after", returnNewDocument: true };
        const requestRefreshToken = await axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`)
        const updateDoc = {
            $set: {
                access_token: requestRefreshToken.data.access_token,
                refresh_token: requestRefreshToken.data.refresh_token,
                expires_at: requestRefreshToken.data.expires_at,
                expires_in: requestRefreshToken.data.expires_in,
                logedin: true
            },
        };
        const existing = await mongoClient.findOneAndUpdate(filter, updateDoc, options).then((result, err) => {
            if (err) {
                console.log(err)
            };
            return result;
        });
        return existing
    } catch (err) {
        return new Error(err)
    } finally {
        await disconnect()
    }
};

