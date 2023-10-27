import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Raleway, Martian_Mono } from "next/font/google";
import Teams from "../../components/Teams";
import styles from "../../styles/Game.module.css";
import Timer from "../../components/Timer";
import Buzzer from "../../components/Buzzer";
import Disconnected from "../../components/Disconnected";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

const martian_mono = Martian_Mono({
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
    const [buzzed, setBuzzed] = useState("buzz");
    const [ping, setPing] = useState([]);
    const [connected, setConnected] = useState(true);

    const teamsRef = useRef();
    teamsRef.current = teams;

    const teamNumber = useRef();

    const initialTimerRef = useRef();
    initialTimerRef.current = initialTimer;

    const timerRef = useRef();
    timerRef.current = timer;

    const timerWorkerRef = useRef();

    const nicknameRef = useRef();
    nicknameRef.current = nickname;

    const idRef = useRef("");

    const [officialBuzzer, setOfficialBuzzer] = useState(false);

    const pingRef = useRef();
    pingRef.current = ping;

    const [question, setQuestion] = useState(1);

    const gameUpdate = (updatedInfo) => {
        setTeams(updatedInfo.teams);
        setRound(updatedInfo.round);
        pauseTimer();
        setInitialTimer(updatedInfo.timer);
        setTimer(updatedInfo.timer);
        if (updatedInfo.buzzed != idRef.current) {
            if (
                updatedInfo.round == "Buzzer Check" &&
                updatedInfo.buzzerChecked.includes(idRef.current)
            ) {
                setBuzzed("buzzed");
            } else if (updatedInfo.buzzed == "") {
                setBuzzed("buzz");
            } else {
                setBuzzed("disabled");
            }
        }
    };

    const kick = () => {
        router.replace("/");
    };

    const startTimer = () => {
        timerWorkerRef.current?.postMessage("start");
    };

    const pauseTimer = () => {
        timerWorkerRef.current?.postMessage("end");
    };

    const resetTimer = () => {
        setTimer(initialTimerRef.current);
        timerWorkerRef.current?.postMessage("end");
        setBuzzed("buzz");
    };

    const endTimer = () => {
        timerWorkerRef.current?.postMessage("end");
        setBuzzed("disabled");
    };

    const handleBuzz = () => {
        setBuzzed("buzzed");
        triggerEvent("buzz", idRef.current);
        timerWorkerRef.current?.postMessage("end");
    };

    const otherBuzz = (id, confirmed) => {
        timerWorkerRef.current?.postMessage("end");
        if (confirmed && id != idRef.current) {
            setBuzzed("disabled");
        }
    };

    const buzzTimer = () => {
        setTimer(3);
        timerWorkerRef.current?.postMessage("startBuzzTimer");
    };

    const endBuzzTimer = () => {
        timerWorkerRef.current?.postMessage("end");
    };

    const handleBuzzerCheck = () => {
        setBuzzed("buzzed");
        triggerEvent("buzzerCheck", idRef.current);
    };

    const updatePing = (ms) => {
        if (ms < 0) {
            return;
        }
        setPing([...pingRef.current, ms]);
    };

    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    const connection = (state) => {
        if (state.current == "connecting") {
            setConnected(false);
        } else if (state.current == "connected") {
            setConnected(true);
        }
    };

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);
        const nickname = router.query.nickname;
        setNickname(nickname);
        const officialBuzzer = router.query.buzzer;
        setOfficialBuzzer(officialBuzzer);

        joinChannel(
            code,
            nickname,
            gameUpdate,
            kick,
            startTimer,
            pauseTimer,
            resetTimer,
            otherBuzz,
            buzzTimer,
            updatePing,
            connection
        ).then((id) => {
            idRef.current = id;
        });

        timerWorkerRef.current = new Worker(
            new URL("../../timerWorker.js", import.meta.url)
        );
        timerWorkerRef.current.onmessage = (e) => {
            const newTime = Math.round((timerRef.current - 0.1) * 10) / 10;
            if (newTime < 0) {
                timerWorkerRef.current?.postMessage("end");
                if (e.data == "buzzTimer") {
                    endBuzzTimer();
                } else {
                    endTimer();
                }
            } else {
                setTimer(newTime);
            }
        };
        return () => {
            timerWorkerRef.current?.terminate();
        };
    }, [router.isReady]);

    useEffect(() => {
        if (!router.isReady) return;

        teamsRef.current.sort((a, b) => {
            return new Date(a.joinTime) - new Date(b.joinTime);
        });

        teamNumber.current =
            teamsRef.current.findIndex(
                (t) => t.nickname == nicknameRef.current
            ) + 1;
    }, [teams, router.isReady]);

    useEffect(() => {
        if (!router.isReady) return;

        return () => {
            disconnect();
        };
    }, [router.isReady]);

    useEffect(() => {
        let questionNumber = 0;
        for (const team of teams) {
            switch (round) {
                case "5 Point Round":
                    questionNumber += team.score.fiveCorrect;
                    questionNumber += team.score.fiveIncorrect;
                    break;
                case "10 Point Round":
                    questionNumber += team.score.tenCorrect;
                    questionNumber += team.score.tenIncorrect;
                    break;
                case "15 Point Round":
                    questionNumber += team.score.fifteenCorrect;
                    questionNumber += team.score.fifteenIncorrect;
                    break;
            }
        }
        questionNumber++;
        setQuestion(questionNumber);
    }, [teams, round]);

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
                        CURRENT TEAM:{" "}
                        <strong>
                            {nickname.slice(0, 20) +
                                (nickname.length > 20 ? "..." : "")}
                        </strong>
                    </h1>
                    {!connected && <Disconnected />}
                </header>
                <hr className={styles.line}></hr>
                <div className={styles.mainContainer}>
                    <div className={styles.buzzContainer}>
                        <h1
                            className={`${raleway.className} ${styles.round}`}
                            style={{
                                marginBottom:
                                    round == "Buzzer Check" ||
                                    round == "Team Questions"
                                        ? 20
                                        : -5,
                            }}
                        >
                            {round ? round : "Waiting for Next Round..."}
                        </h1>
                        {round &&
                            round != "Buzzer Check" &&
                            round != "Team Questions" && (
                                <h1
                                    className={`${raleway.className} ${styles.question}`}
                                >{`Question ${question}`}</h1>
                            )}
                        {round && round != "Buzzer Check" && (
                            <>
                                <Timer host={false} time={timer} />
                                {round != "Team Questions" && (
                                    <div className={styles.buzzerContainer}>
                                        <Buzzer
                                            buzzed={buzzed}
                                            handleBuzz={handleBuzz}
                                            official={officialBuzzer}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {round == "Buzzer Check" && (
                            <div className={styles.buzzerCheckContainer}>
                                <Buzzer
                                    buzzed={buzzed}
                                    handleBuzz={handleBuzzerCheck}
                                    official={officialBuzzer}
                                />
                            </div>
                        )}
                        {round && ping.length != 0 && (
                            <div
                                className={`${martian_mono.className} ${styles.ping}`}
                            >
                                Last Message Ping:{" "}
                                <b>{ping[ping.length - 1]} ms</b> Average Ping:{" "}
                                <b>{Math.round(average(ping))} ms</b>
                            </div>
                        )}
                    </div>
                    <Teams teams={teams} host={false} />
                </div>
            </div>
        </div>
    );
}
