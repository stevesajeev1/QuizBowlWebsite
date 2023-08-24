const PUSHER_APP_KEY = "ff3e08947915317eaddc";
const PUSHER_CLUSTER_REGION = "us2";

// Initialize Channels client
let channels = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_CLUSTER_REGION,
});

// Subscribe to the appropriate channel
let channel = channels.subscribe("channel");

// Bind a callback function to an event within the subscribed channel
channel.bind("event", function (data) {
    console.log("event received: ");
    console.log(data);
});

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
