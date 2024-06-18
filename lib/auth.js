import { clients } from "../config/mongodb.js";

export const auth = async (req, res, next) => {
    try {
        const athleteid = req.cookies.athleteid;
        const mongoClient = await clients('Accounts')
        if (!athleteid) {
            throw res.status(401).json('UnAuthorized');
        };
        const checkUser = await mongoClient.findOne({ athleteid: parseInt(athleteid) });
        if (checkUser.logedin) {
            next()
        } else {
            throw res.status(401).json('UnAuthorized');
        }
    } catch (err) {
        next(err)
    } finally {
    }
}