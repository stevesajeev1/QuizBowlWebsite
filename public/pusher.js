const PUSHER_APP_KEY = "ff3e08947915317eaddc";
const PUSHER_CLUSTER_REGION = "us2";

// Channels client
let channels;
let channel;
let channelCode;

async function getTime() {
    const startAPICall = new Date();
    const res = await fetch(
        "https://worldtimeapi.org/api/timezone/America/New_York"
    );
    const data = await res.json();
    const endAPICall = new Date();
    return {
        time: data.datetime,
        apiPing: Math.floor((endAPICall - startAPICall) / 2),
    };
}

async function updatePing(eventData, pingCallback) {
    const triggerTime = eventData.time;
    const triggerPing = eventData.timePing;
    const currentTime = await getTime();
    const ping =
        new Date(currentTime.time) -
        new Date(triggerTime) -
        currentTime.apiPing -
        triggerPing;
    pingCallback(ping);
}

function hostChannel(
    code,
    teamJoinCallback,
    teamLeaveCallback,
    buzzCallback,
    buzzerCheckCallback
) {
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

    channelCode = `presence-${code}`;
    channel = channels.subscribe(channelCode);

    // Listen for member add
    channel.bind("pusher:member_added", (member) => {
        teamJoinCallback(member);
    });
    // listen for member leave
    channel.bind("pusher:member_removed", (member) => {
        teamLeaveCallback(member);
    });

    // listen for buzz
    channel.bind("client-buzz", (eventData) => {
        buzzCallback(eventData);
    });

    // listen for buzzer check
    channel.bind("client-buzzerCheck", (eventData) => {
        const id = eventData.data;
        buzzerCheckCallback(id);
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

    return new Promise((resolve) => {
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

function joinChannel(
    code,
    nickname,
    updateCallback,
    kickCallback,
    startTimerCallback,
    pauseTimerCallback,
    resetTimerCallback,
    buzzCallback,
    buzzTimerCallback,
    pingCallback
) {
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

    channelCode = `presence-${code}`;
    channel = channels.subscribe(channelCode);

    // Listen for update from host
    channel.bind("client-update", (eventData) => {
        const data = eventData.data;
        updateCallback(data);
        updatePing(eventData, pingCallback);
    });

    // listen for event to disconnect
    channel.bind("client-kick", (eventData) => {
        const teamID = eventData.data;
        if (teamID == channel.members.me.id) {
            channels.disconnect();
            kickCallback();
        }
        updatePing(eventData, pingCallback);
    });

    // listen for timer events
    channel.bind("client-timer", (eventData) => {
        const eventType = eventData.data;
        switch (eventType) {
            case "start":
                startTimerCallback();
                break;
            case "pause":
                pauseTimerCallback();
                break;
            case "reset":
                resetTimerCallback();
                break;
        }
        updatePing(eventData, pingCallback);
    });

    // listen for member leave
    channel.bind("pusher:member_removed", (member) => {
        const memberInfo = member.info;
        if (memberInfo.isHost) {
            channels?.unsubscribe(channelCode);
            channels?.disconnect();
            channels = null;
            channel = null;
            kickCallback();
        }
    });

    // listen for buzz
    channel.bind("client-buzz", (eventData) => {
        const id = eventData.data;
        buzzCallback(id, false);
        updatePing(eventData, pingCallback);
    });

    // listen for confirmed buzz
    channel.bind("client-confirmedBuzz", (eventData) => {
        const id = eventData.data;
        buzzCallback(id, true);
        updatePing(eventData, pingCallback);
    });

    // listen for starting buzz timer
    channel.bind("client-buzzTimer", (eventData) => {
        const ping = new Date() - new Date(eventData.time);
        buzzTimerCallback();
        pingCallback(ping);
    });

    return new Promise((resolve) => {
        channel.bind("pusher:subscription_succeeded", () => {
            const me = channel.members.me;
            resolve(me.id);
        });
    });
}

async function triggerEvent(event, data) {
    const currentTime = await getTime();
    const eventData = {
        data: data,
        time: currentTime.time,
        timePing: currentTime.apiPing,
    };
    channel.trigger(`client-${event}`, eventData);
}

function disconnect() {
    if (channelCode != null) {
        channels?.unsubscribe(channelCode);
        channels?.disconnect();
        channels = null;
        channel = null;
        channelCode = null;
    }
}
