import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Domine, Raleway } from "next/font/google";
import Teams from "../../components/Teams";
import styles from "../../styles/Game.module.css";
import Timer from "../../components/Timer";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

const domine = Domine({
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

    const timerInterval = useRef();

    const memberLeave = (member) => {
        const memberInfo = member.info;
        if (memberInfo.isHost) {
            kick();
        }
    };

    const gameUpdate = (updatedInfo) => {
        setTeams(updatedInfo.teams);
        setRound(updatedInfo.round);
        pauseTimer();
        setInitialTimer(updatedInfo.timer);
        setTimer(updatedInfo.timer);
        setTimerStarted(false);
    };

    const kick = () => {
        router.push("/");
    };

    const startTimer = () => {
        setTimerStarted(true);
        timerInterval.current = setInterval(() => {
            const newTime = Math.round((timerRef.current - 0.1) * 10) / 10;
            if (newTime < 0) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
                endTimer();
            } else {
                setTimer(newTime);
            }
        }, 100);
    };

    const pauseTimer = () => {
        setTimerStarted(false);
        clearInterval(timerInterval.current);
        timerInterval.current = null;
    };

    const resetTimer = () => {
        setTimer(initialTimerRef.current);
        setTimerStarted(false);
        clearInterval(timerInterval.current);
        timerInterval.current = null;
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
            memberLeave,
            gameUpdate,
            kick,
            startTimer,
            pauseTimer,
            resetTimer
        );
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
                                    host={true}
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
