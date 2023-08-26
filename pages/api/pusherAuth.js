const Channels = require("pusher");
const { v4: uuidv4 } = require('uuid');

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
    const data = req.body;
    return new Promise((resolve, reject) => {
        const socketID = data.socket_id;
        const channel = data.channel_name;

        const user_info = {
            isHost: (data.host === "true"),
            isSpectating: (data.spectating === "true"),
            nickname: data.nickname
        }

        const presenceData = {
            user_id: uuidv4(),
            user_info: user_info
        }

        const authResponse = channels.authorizeChannel(socketID, channel, presenceData);
        res.send(authResponse);
        resolve();
    });
};