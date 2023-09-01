import styles from "../styles/Timer.module.css";
import { Raleway, Martian_Mono } from "next/font/google";
import { useState, useEffect } from "react";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

const martian_mono = Martian_Mono({
    subsets: ["latin"],
    display: "swap",
});

function Timer(props) {
    const [time, setTime] = useState(props.time);
    const [started, setStarted] = useState(props.started);

    const changeTimer = () => {
        if (!props.host) {
            return;
        }

        props.pauseTimer();

        setTimeout(() => {
            const newTime = prompt("What should the timer be set to?");
            if (!newTime || newTime <= 0 || isNaN(parseFloat(newTime))) {
                return;
            }

            const roundedTime = Math.round(parseFloat(newTime) * 10) / 10;
            if (roundedTime <= 0) {
                return;
            }

            props.updateTimer(roundedTime);
        }, 10);
    };

    const handleTimer = () => {
        if (started) {
            props.pauseTimer();
        } else {
            props.startTimer();
        }
    };

    const padded = (time) => {
        let paddedTime = time.toString();
        for (let i = 0; i < 5 - time.toString().length; i++) {
            paddedTime += String.fromCharCode(160);
        }
        return paddedTime;
    };

    useEffect(() => {
        setTime(props.time);
    }, [props.time]);

    useEffect(() => {
        setStarted(props.started);
    }, [props.started]);

    return (
        <div className={styles.timerContainer}>
            <div className={`${martian_mono.className} ${styles.timer}`}>
                Timer:
                <span
                    className={`${styles.time} ${
                        props.host ? styles.timerHost : ""
                    }`}
                    onClick={changeTimer}
                >
                    {padded(time)}
                </span>
                s
            </div>
            {props.host && (
                <div className={styles.buttons}>
                    <div
                        className={`${raleway.className} ${styles.button} ${
                            started ? styles.pause : ""
                        }`}
                        onClick={handleTimer}
                    >
                        {started ? "Pause" : "Start"} Timer
                    </div>
                    <div
                        className={`${raleway.className} ${styles.button}`}
                        onClick={props.resetTimer}
                    >
                        Reset Timer
                    </div>
                </div>
            )}
        </div>
    );
}

export default Timer;
