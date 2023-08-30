import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Raleway } from "next/font/google";
import Teams from "../../components/Teams";
import styles from "../../styles/Game.module.css";
import Timer from "../../components/Timer";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

export default function Game() {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");
    const [teams, setTeams] = useState([]);
    const [round, setRound] = useState("");
    const [initialTimer, setInitialTimer] = useState(60);
    const [timer, setTimer] = useState(60);
    const [timerStarted, setTimerStarted] = useState(false);

    const initialTimerRef = useRef();
    initialTimerRef.current = initialTimer;

    const timerRef = useRef();
    timerRef.current = timer;

    const timerWorkerRef = useRef();

    const gameUpdate = (updatedInfo) => {
        setTeams(updatedInfo.teams);
        setRound(updatedInfo.round);
        pauseTimer();
        setInitialTimer(updatedInfo.timer);
        setTimer(updatedInfo.timer);
        setTimerStarted(false);
    };

    const kick = () => {
        router.replace("/");
    };

    const startTimer = () => {
        setTimerStarted(true);
        timerWorkerRef.current?.postMessage("start");
    };

    const pauseTimer = () => {
        setTimerStarted(false);
        timerWorkerRef.current?.postMessage("end");
    };

    const resetTimer = () => {
        setTimer(initialTimerRef.current);
        setTimerStarted(false);
        timerWorkerRef.current?.postMessage("end");
    };

    const endTimer = () => {};

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);
        const nickname = router.query.nickname;
        setNickname(nickname);

        joinChannel(
            code,
            nickname,
            gameUpdate,
            kick,
            startTimer,
            pauseTimer,
            resetTimer
        );

        timerWorkerRef.current = new Worker(new URL("../../timerWorker.js", import.meta.url));
        timerWorkerRef.current.onmessage = () => {
            const newTime = Math.round((timerRef.current - 0.1) * 10) / 10;
            if (newTime < 0) {
                timerWorkerRef.postMessage("end");
                endTimer();
            } else {
                setTimer(newTime);
            }
        };
        return () => {
            timerWorkerRef.current?.terminate();
        }
    }, [router.isReady]);

    return (
        <div className="container">
            <Head>
                <title>Quiz Bowl Buzzer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="background"></div>
            <Link href="/">
                <Image
                    className="logo"
                    src="/logo.png"
                    width={110}
                    height={110}
                    alt="Logo"
                />
            </Link>

            <div className={styles.gameContainer}>
                <header className={raleway.className}>
                    <h1 className={styles.code}>
                        GAME CODE: <strong>{code}</strong>
                    </h1>
                    <h1 className={styles.nickname}>
                        CURRENT TEAM: <strong>{nickname}</strong>
                    </h1>
                </header>
                <hr className={styles.line}></hr>
                <div className={styles.mainContainer}>
                    <div className={styles.buzzContainer}>
                        <h1 className={`${raleway.className} ${styles.round}`}>
                            {round ? round : "Waiting for Next Round..."}
                        </h1>
                        {round && (
                            <>
                                <Timer
                                    host={false}
                                    time={timer}
                                    started={timerStarted}
                                />
                            </>
                        )}
                    </div>
                    <Teams teams={teams} host={false} />
                </div>
            </div>
        </div>
    );
}
