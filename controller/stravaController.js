import { client, clients } from "../config/mongodb.js";
import request from 'request'


const getRefreshToken = async (client_id, client_secret, refresh_token) => {
    try {
        const clientss = await clients('Accounts');
        await clientss.findOne({ client_id: '128672' }, (err, result) => {
            if (err) {
                throw err;
            }
        })
        request.post(`https://www.strava.com/oauth/token?client_id=128672&client_secret=291d4656589fab4a77307a7a71392283b6ca7aa4&code=${code}&grant_type=refresh_token`, async (error, response, body) => {
            const responseBody = JSON.parse(response.body)
            await clientss.insertOne({
                client_id,
                client_secret,
                refresh_token,
                access_token,
                expires_at,
                expires_in
            });
        });
    } catch (err) {
        return new Error(err)
    }
};


export const getStraveAPI = async (req, res) => {
    try {
        const { code } = req.query;
        const clientss = await clients('Accounts');
        let client_id, client_secret, refresh_token, access_token, expires_at, expires_in
        const existing = await clientss.findOne({ client_id: '128672' }, (err, result) => {
            if (err) {
                throw err;
            };
            return result;
        });
        if (existing) {
            client_id = result.client_id;
            client_secret = result.client_secret;
            refresh_token = result.refresh_token;
            access_token = result.access_token;
            expires_at = result.expires_at;
            expires_in = request.expires_in;
            if (expires_at < Date.now() / 1000) {
                await getRefreshToken('128672', '291d4656589fab4a77307a7a71392283b6ca7aa4', refresh_token)
            }

        } else {
            request.post(`https://www.strava.com/oauth/token?client_id=128672&client_secret=291d4656589fab4a77307a7a71392283b6ca7aa4&code=${code}&grant_type=authorization_code`, async (error, response, body) => {
                const responseBody = JSON.parse(response.body)
                if (responseBody.expires_at < Date.now() / 1000) {
                    //expired
                    await getRefreshToken('128672', '291d4656589fab4a77307a7a71392283b6ca7aa4', responseBody.refresh_token)
                } else {
                    client_id = responseBody.client_id;
                    client_secret = responseBody.client_secret;
                    refresh_token = responseBody.refresh_token;
                    access_token = responseBody.access_token;
                    expires_in = responseBody.expires_in
                    await clientss.insertOne({
                        client_id: client_id,
                        client_secret,
                        refresh_token,
                        access_token,
                        expires_at,
                        expires_in
                    });
                }

            });
        }

        return res.status(200).json(`Successfully Login`)
    } catch (err) {
        return res.status(200).json({ success: true, message: "router doesn't works" })
    } finally {
        console.log('done')
    }
};


export const postData = async (req, res) => {
    try {
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