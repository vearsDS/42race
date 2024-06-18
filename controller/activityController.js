import { clients, disconnect } from "../config/mongodb.js";


export const fetchActivities = async (req, res) => {
    try {
        const mongoClient = await clients('Activity');
        let filter = {}

        Object.keys(req.query).map(key => {
            if (key === 'user') {
                if (req.params[key]) {
                    Object.assign(filter, { "athelete.id": req.query[key] })
                }
            } else {
                Object.assign(filter, { [key]: req.query[key] })
            }
        });
        const fetchActivity = await mongoClient.find(filter, {
            projection: {
                name: 1, athlete: 1, type: 1, start_date_local: 1, activityid: 1
            }
        }).toArray();
        if (fetchActivity.length === 0) {
            throw { code: 404, message: `No Activities Found` }
        };

        return res.status(200).json({ success: true, data: fetchActivity });
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error get activities' })
    }
};

export const fetchActivity = async (req, res) => {
    try {
        const mongoClient = await clients('Activity');
        const { id } = req.params
        let filter = { id: parseInt(id) }

        const fetchActivity = await mongoClient.findOne(filter);
        if (!fetchActivity) {
            throw { code: 404, message: `No Activity Found` }
        };
        return res.status(200).json({ success: true, data: fetchActivity });
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error get activity' })
    }
}

export const deleteActivity = async (req, res) => {
    try {
        const mongoClient = await clients('Activity');
        const { id } = req.params;
        let filter = { id: parseInt(id) }

        const deleteActivity = await mongoClient.deleteOne(filter);
        if (deleteActivity.deletedCount !== 1) {
            throw { code: 404, message: `Deleted 0 documents.` }
        };

        return res.status(200).json({ success: true, message: `Successfully deleted activity ${id}` });
    } catch (err) {
        console.log(err);
        return res.status(err.code ? err.code : 500).json({ success: false, message: err.message ? err.message : 'Error delete activity' })
    }
}