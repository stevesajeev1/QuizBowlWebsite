const PUSHER_APP_KEY = "ff3e08947915317eaddc";
const PUSHER_CLUSTER_REGION = "us2";

// Channels client
let channels;
let channel;

function hostChannel(code, teamJoinCallback, teamLeaveCallback) {
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
    
    // Listen for member add
    channel.bind("pusher:member_added", (member) => {
        teamJoinCallback(member);
    });
    // listen for member leave
    channel.bind("pusher:member_removed", (member) => {
        teamLeaveCallback(member);
    });
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
                if (
                    !(member.isHost || member.isSpectating) &&
                    nickname == member.nickname
                ) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
}

function joinChannel(code, nickname, updateCallback, kickCallback) {
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

    // Listen for update from host
    channel.bind("client-update", (data) => {
        updateCallback(data);
    });

    channel.bind("client-kick", teamID => {
        if (teamID == channel.members.me.id) {
            channels.disconnect();
            kickCallback();
        }
    });
}

async function triggerEvent(event, data) {
    channel.trigger(`client-${event}`, data);
}
