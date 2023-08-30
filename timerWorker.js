let timerInterval;

onmessage = (e) => {
    switch (e.data) {
        case "start":
            timerInterval = setInterval(() => {
                postMessage("");
            }, 100);
            break;
        case "end":
            clearInterval(timerInterval);
            timerInterval = null;
            break;
    }
}