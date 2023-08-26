const PUSHER_APP_KEY = "ff3e08947915317eaddc";
const PUSHER_CLUSTER_REGION = "us2";

console.log("Pusher loaded");

// Channels client
let channels;
let channel;

function hostChannel(code) {
    // Initialize host client
    channels = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_CLUSTER_REGION,
        channelAuthorization: {
            endpoint: "/api/pusherAuth",
            params: {
                host: true,
                spectating: false,
                nickname: "",
            },
        },
    });

    channel = channels.subscribe(`presence-${code}`);
    console.log(channel);
}

async function nicknameInUse(code, nickname) {
    // Initialize regular client
    channels = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_CLUSTER_REGION,
        channelAuthorization: {
            endpoint: "/api/pusherAuth",
            params: {
                host: false,
                spectating: true,
                nickname: "",
            },
        },
    });

    channel = channels.subscribe(`presence-${code}`);

    return new Promise((resolve, reject) => {
        channel.bind("pusher:subscription_succeeded", (members) => {
            const membersObject = members.members;
            for (const memberKey in membersObject) {
                const member = membersObject[memberKey];
                if (!(member.isHost || member.isSpectating) && nickname == member.nickname) {
                    console.log("Same nickname");
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
}

function joinChannel(code, nickname) {
    console.log("Join channel");
    // Initialize regular client
    channels = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_CLUSTER_REGION,
        channelAuthorization: {
            endpoint: "/api/pusherAuth",
            params: {
                host: false,
                spectating: false,
                nickname: nickname,
            },
        },
    });

    channel = channels.subscribe(`presence-${code}`);
    console.log(channel);
}

async function pushData(data) {
    const res = await fetch("/api/channels-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        console.error("failed to push data");
    }
}
