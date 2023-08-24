const Channels = require("pusher");

const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
const PUSHER_APP_KEY = "ff3e08947915317eaddc";
const PUSHER_SECRET = process.env.PUSHER_SECRET;
const PUSHER_CLUSTER_REGION = "us2";

const channels = new Channels({
    appId: PUSHER_APP_ID,
    key: PUSHER_APP_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER_REGION,
});

module.exports = (req, res) => {
    const data = req.body;
    return new Promise((resolve, reject) => {
        channels.trigger("channel", "event", data, () => {
            res.status(200).end("sent event successfully");
            resolve();
        }).catch(error => {
            res.status(500).end();
            resolve();
        });
    });
};