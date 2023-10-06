const Channels = require("pusher");

const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
const PUSHER_APP_KEY = process.env.PUSHER_APP_KEY;
const PUSHER_SECRET = process.env.PUSHER_SECRET;
const PUSHER_CLUSTER_REGION = process.env.PUSHER_CLUSTER_REGION;

const channels = new Channels({
    appId: PUSHER_APP_ID,
    key: PUSHER_APP_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER_REGION,
});

module.exports = (req, res) => {
    const code = req.body;
    return new Promise((resolve) => {
        channels
            .get({ path: "/channels", params: {} })
            .then((response) => response.json())
            .then((body) => {
                if (`presence-${code}` in body.channels) {
                    res.status(200).end();
                } else {
                    res.status(500).end();
                }
                resolve();
            });
    });
};
