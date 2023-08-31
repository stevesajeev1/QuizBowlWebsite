import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Host.module.css";
import { Raleway } from "next/font/google";
import Teams from "../../components/Teams";
import Buttons from "../../components/Buttons";
import Timer from "../../components/Timer";
import BuzzedTeam from "../../components/BuzzedTeam";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

export default function Host() {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [teams, setTeams] = useState([]);
    const [round, setRound] = useState("");
    const [initialTimer, setInitialTimer] = useState(60);
    const [timer, setTimer] = useState(60);
    const [timerStarted, setTimerStarted] = useState(false);
    const [buzzed, setBuzzed] = useState("");

    const roundRef = useRef();
    roundRef.current = round;

    const teamsRef = useRef();
    teamsRef.current = teams;

    let teamsDictionary = useRef();

    const initialTimerRef = useRef();
    initialTimerRef.current = initialTimer;

    const timerRef = useRef();
    timerRef.current = timer;

    const timerWorkerRef = useRef();

    const buzzedRef = useRef();
    buzzedRef.current = buzzed;

    const audioRef = useRef();
    const speechSynthesisRef = useRef();

    const teamJoin = (team) => {
        const teamInfo = team.info;
        teamInfo.id = team.id;
        teamInfo.joinTime = new Date();
        teamInfo.score = {
            totalScore: 100,
            fiveCorrect: 0,
            fiveIncorrect: 0,
            tenCorrect: 0,
            tenIncorrect: 0,
            fifteenCorrect: 0,
            fifteenIncorrect: 0,
        };

        if (!(teamInfo.isHost || teamInfo.isSpectating)) {
            const newTeams = [...teamsRef.current, teamInfo];
            setTeams(newTeams);
            triggerEvent("update", {
                round: roundRef.current,
                teams: newTeams,
                timer: initialTimerRef.current,
                buzzed: buzzedRef.current,
            });
        }
    };

    const teamLeave = (team) => {
        const teamInfo = team.info;
        if (!(teamInfo.isHost || teamInfo.isSpectating)) {
            const newTeams = [...teamsRef.current];
            newTeams.splice(
                newTeams.findIndex((t) => t.id == team.id),
                1
            );
            setTeams(newTeams);
            if (team.id == buzzedRef.current) {
                setBuzzed("");
                triggerEvent("update", {
                    round: roundRef.current,
                    teams: newTeams,
                    timer: initialTimerRef.current,
                    buzzed: "",
                });
            } else {
                triggerEvent("update", {
                    round: roundRef.current,
                    teams: newTeams,
                    timer: initialTimerRef.current,
                    buzzed: buzzedRef.current,
                });
            }
        }
    };

    const teamOverrideScore = (teamID, newTotalScore) => {
        const team = teamsRef.current.findIndex((t) => t.id == teamID);

        const newTeam = structuredClone(teamsRef.current[team]);
        const newScore = structuredClone(teamsRef.current[team].score);

        newScore.totalScore = newTotalScore;
        newTeam.score = newScore;

        const newTeams = [...teamsRef.current];
        newTeams[team] = newTeam;

        setTeams(newTeams);
        triggerEvent("update", {
            round: roundRef.current,
            teams: newTeams,
            timer: initialTimerRef.current,
            buzzed: buzzedRef.current,
        });
    };

    const kickTeam = (teamID) => {
        triggerEvent("kick", teamID);
    };

    const buzzerCheck = () => {
        console.log("Perform buzzer check");
    };

    const startRound = (round) => {
        setRound(round);
        setBuzzed("");

        pauseTimer();
        setTimerStarted(false);
        if (round == "Team Questions") {
            setInitialTimer(120);
            setTimer(120);
            triggerEvent("update", {
                round: round,
                teams: teamsRef.current,
                timer: 120,
                buzzed: buzzedRef.current,
            });
        } else {
            setInitialTimer(60);
            setTimer(60);
            triggerEvent("update", {
                round: round,
                teams: teamsRef.current,
                timer: 60,
                buzzed: buzzedRef.current,
            });
        }
    };

    const changeTimer = (newTime) => {
        pauseTimer();
        setInitialTimer(newTime);
        setTimer(newTime);
        setTimerStarted(false);
        triggerEvent("update", {
            round: roundRef.current,
            teams: teamsRef.current,
            timer: newTime,
            buzzed: buzzedRef.current,
        });
    };

    const startTimer = () => {
        triggerEvent("timer", "start");
        setTimerStarted(true);
        timerWorkerRef.current?.postMessage("start");
    };

    const pauseTimer = () => {
        triggerEvent("timer", "pause");
        setTimerStarted(false);
        timerWorkerRef.current?.postMessage("end");
    };

    const resetTimer = () => {
        triggerEvent("timer", "reset");
        setTimer(initialTimerRef.current);
        setTimerStarted(false);
        timerWorkerRef.current?.postMessage("end");
    };

    const endTimer = () => {
        setTimerStarted(false);
        audioRef.current = new Audio("/buzzTimeUp.wav");
        audioRef.current.play();
        audioRef.current.onended = () => {
            audioRef.current = null;
        }
    };

    const handleBuzz = (id) => {
        playBuzzAudio(id);
        setTimerStarted(false);
        timerWorkerRef.current?.postMessage("end");
        setBuzzed(id);
    };

    const playBuzzAudio = (id) => {
        audioRef.current = new Audio("/buzz.wav");
        audioRef.current.play();
        audioRef.current.onended = () => {
            audioRef.current = null;
            const msg = new SpeechSynthesisUtterance(`Team ${teamsDictionary.current[id].number}: ${teamsDictionary.current[id].nickname}`);
            msg.voice = speechSynthesisRef.current.getVoices()[6];
            speechSynthesisRef.current.speak(msg);

            msg.onend = () => {
                triggerEvent("buzzTimer", "");
                buzzTimer();
            }
        }
    }

    const buzzTimer = () => {
        setTimer(3);
        setTimerStarted(true);
        timerWorkerRef.current?.postMessage("startBuzzTimer");
    }

    const endBuzzTimer = () => {
        setTimerStarted(false);
        audioRef.current = new Audio("/buzzTimeUp.wav");
        audioRef.current.play();
        audioRef.current.onended = () => {
            audioRef.current = null;
        }
        timerWorkerRef.current?.postMessage("end");
    }

    const correctResponse = (teamID) => {
        const team = teamsRef.current.findIndex((t) => t.id == teamID);

        const newTeam = structuredClone(teamsRef.current[team]);
        const newScore = structuredClone(teamsRef.current[team].score);

        switch (roundRef.current) {
            case "5 Point Round":
                newScore.totalScore += 5;
                newScore.fiveCorrect++;
                break;
            case "10 Point Round":
                newScore.totalScore += 10;
                newScore.tenCorrect++;
                break;
            case "15 Point Round":
                newScore.totalScore += 15;
                newScore.fifteenCorrect++;
                break;
        }

        newTeam.score = newScore;

        const newTeams = [...teamsRef.current];
        newTeams[team] = newTeam;

        setTeams(newTeams);
        setBuzzed("");
        setTimer(initialTimerRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (speechSynthesisRef.current.speaking) {
            speechSynthesisRef.current.cancel();
        }
        triggerEvent("update", {
            round: roundRef.current,
            teams: newTeams,
            timer: initialTimerRef.current,
            buzzed: "",
        });
    }

    const incorrectResponse = (teamID) => {
        const team = teamsRef.current.findIndex((t) => t.id == teamID);

        const newTeam = structuredClone(teamsRef.current[team]);
        const newScore = structuredClone(teamsRef.current[team].score);

        switch (roundRef.current) {
            case "5 Point Round":
                newScore.totalScore -= 5;
                newScore.fiveIncorrect++;
                break;
            case "10 Point Round":
                newScore.totalScore -= 10;
                newScore.tenIncorrect++;
                break;
            case "15 Point Round":
                newScore.totalScore -= 15;
                newScore.fifteenIncorrect++;
                break;
        }

        newTeam.score = newScore;

        const newTeams = [...teamsRef.current];
        newTeams[team] = newTeam;

        setTeams(newTeams);
        setBuzzed("");
        setTimer(initialTimerRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (speechSynthesisRef.current.speaking) {
            speechSynthesisRef.current.cancel();
        }
        triggerEvent("update", {
            round: roundRef.current,
            teams: newTeams,
            timer: initialTimerRef.current,
            buzzed: "",
        });
    }

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);

        hostChannel(code, teamJoin, teamLeave, handleBuzz);

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
        teamsRef.current.sort((a, b) => {
            return new Date(a.joinTime) - new Date(b.joinTime);
        });

        teamsDictionary.current = Object.fromEntries(
            teamsRef.current.map((t, index) => [
                t.id,
                { number: index + 1, nickname: t.nickname },
            ])
        );
    }, [teams]);

    useEffect(() => {
        speechSynthesisRef.current = window.speechSynthesis;
    }, []);

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

            <div className={styles.hostContainer}>
                <h1 className={`${raleway.className} ${styles.code}`}>
                    GAME CODE: <strong>{code}</strong>
                </h1>
                <hr className={styles.line}></hr>
                <div className={styles.mainContainer}>
                    <div className={styles.settingsContainer}>
                        <Buttons
                            buzzerCheck={buzzerCheck}
                            startRound={(round) => {
                                startRound(round);
                            }}
                        />
                        <h1 className={`${raleway.className} ${styles.round}`}>
                            {round ? round : "Waiting for Next Round..."}
                        </h1>
                        {round && round != "Buzzer Check" && (
                            <>
                                <Timer
                                    host={true}
                                    time={timer}
                                    started={timerStarted}
                                    updateTimer={(newTime) => {
                                        changeTimer(newTime);
                                    }}
                                    startTimer={startTimer}
                                    pauseTimer={pauseTimer}
                                    resetTimer={resetTimer}
                                />
                                {buzzed && (
                                    <div
                                        className={`${raleway.className} ${styles.buzzedTeam}`}
                                    >
                                        <BuzzedTeam
                                            team={
                                                teamsDictionary.current[buzzed]
                                            }
                                            correctResponse={
                                                () => {
                                                    correctResponse(buzzed);
                                                }
                                            }
                                            incorrectResponse={
                                                () => {
                                                    incorrectResponse(buzzed);
                                                }
                                            }
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <Teams
                        teams={teams}
                        host={true}
                        overrideScore={teamOverrideScore}
                        kickTeam={kickTeam}
                    />
                </div>
            </div>
        </div>
    );
}
