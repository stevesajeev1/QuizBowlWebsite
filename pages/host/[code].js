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

    const teamsRef = useRef();
    teamsRef.current = teams;

    const timerRef = useRef();
    timerRef.current = timer;

    const timerInterval = useRef();

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
            teamQuestions: 0,
        };

        if (!(teamInfo.isHost || teamInfo.isSpectating)) {
            const newTeams = [...teamsRef.current, teamInfo];
            setTeams(newTeams);
            triggerEvent("update", {
                round: round,
                teams: newTeams,
                timer: initialTimer,
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
            triggerEvent("update", {
                round: round,
                teams: newTeams,
                timer: initialTimer,
            });
        }
    };

    const teamOverrideScore = (teamID, newTotalScore) => {
        const team = teams.findIndex((t) => t.id == teamID);

        const newTeam = structuredClone(teams[team]);
        const newScore = structuredClone(teams[team].score);

        newScore.totalScore = newTotalScore;
        newTeam.score = newScore;

        const newTeams = [...teamsRef.current];
        newTeams[team] = newTeam;

        setTeams(newTeams);
        triggerEvent("update", {
            round: round,
            teams: newTeams,
            timer: initialTimer,
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
        triggerEvent("update", {
            round: round,
            teams: teams,
            timer: initialTimer,
        });
    };

    const changeTimer = (newTime) => {
        pauseTimer();
        setInitialTimer(newTime);
        setTimer(newTime);
        setTimerStarted(false);
        triggerEvent("update", {
            round: round,
            teams: teams,
            timer: newTime,
        });
    };

    const startTimer = () => {
        triggerEvent("timer", "start");
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
        triggerEvent("timer", "pause");
        setTimerStarted(false);
        clearInterval(timerInterval.current);
        timerInterval.current = null;
    };

    const resetTimer = () => {
        setTimer(initialTimer);
        triggerEvent("timer", "reset");
    };

    const endTimer = () => {};

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);

        hostChannel(code, teamJoin, teamLeave);
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
                        {round && (
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
