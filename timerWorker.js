let timerInterval;

onmessage = (e) => {
    switch (e.data) {
        case "start":
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                postMessage("");
            }, 100);
            break;
        case "end":
            clearInterval(timerInterval);
            timerInterval = null;
            break;
        case "startBuzzTimer":
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                postMessage("buzzTimer");
            }, 100);
            break;
    }
}