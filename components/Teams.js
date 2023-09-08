import styles from "../styles/Teams.module.css";
import { Domine, Raleway, Martian_Mono } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";

const domine = Domine({
    subsets: ["latin"],
    display: "swap",
});

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

const martian_mono = Martian_Mono({
    subsets: ["latin"],
    display: "swap",
});

function Teams(props) {
    const [teams, setTeams] = useState(JSON.parse(JSON.stringify(props.teams)));

    props.teams.sort((a, b) => {
        return new Date(a.joinTime) - new Date(b.joinTime);
    });
    let teamNumbers = Object.fromEntries(
        props.teams.map((t, index) => [t.id, index + 1])
    );

    props.teams.sort((a, b) => {
        return b.score.totalScore - a.score.totalScore;
    });

    const overrideScore = (teamID) => {
        if (!props.host) {
            return;
        }

        const newTotalScore = prompt("What is the updated score?");
        if (!newTotalScore) {
            return;
        }

        props.overrideScore(teamID, newTotalScore);
    };

    useEffect(() => {
        props.teams.sort((a, b) => {
            return new Date(a.joinTime) - new Date(b.joinTime);
        });

        teamNumbers = Object.fromEntries(
            props.teams.map((t, index) => [t.id, index + 1])
        );
        props.teams.sort((a, b) => {
            return b.score.totalScore - a.score.totalScore;
        });
        setTeams(props.teams);
    }, [props.teams]);

    return (
        <ul className={styles.teamsContainer}>
            <h1 className={`${domine.className} ${styles.teamsHeader}`}>
                TEAMS
            </h1>
            {teams.map((team) => (
                <li
                    key={team.id}
                    className={`${raleway.className} ${styles.team}`}
                >
                    <div className={styles.teamName}>
                        Team {teamNumbers[team.id]}:{" "}
                        <strong>
                            {team.nickname.slice(0, 20) +
                                (team.nickname.length > 20 ? "..." : "")}
                        </strong>
                        {props.host && (
                            <Image
                                className={styles.kick}
                                src="/kickIcon.svg"
                                width={16}
                                height={16}
                                alt="Kick"
                                onClick={() => {
                                    props.kickTeam(team.id);
                                }}
                            />
                        )}
                    </div>
                    <div className={styles.teamStats}>
                        <div
                            className={`${martian_mono.className} ${
                                styles.teamScore
                            } ${props.host ? styles.teamScoreHost : ""}`}
                            onClick={() => {
                                overrideScore(team.id);
                            }}
                        >
                            {team.score.totalScore}
                        </div>
                        <div className={styles.scoreBreakdown}>
                            <div
                                className={`${martian_mono.className} ${styles.round}`}
                            >
                                5 Point Round:{" "}
                                <span className={styles.correct}>
                                    {team.score.fiveCorrect}
                                </span>
                                /
                                <span className={styles.incorrect}>
                                    {team.score.fiveIncorrect}
                                </span>
                            </div>
                            <div
                                className={`${martian_mono.className} ${styles.round}`}
                            >
                                10 Point Round:{" "}
                                <span className={styles.correct}>
                                    {team.score.tenCorrect}
                                </span>
                                /
                                <span className={styles.incorrect}>
                                    {team.score.tenIncorrect}
                                </span>
                            </div>
                            <div
                                className={`${martian_mono.className} ${styles.round}`}
                            >
                                15 Point Round:{" "}
                                <span className={styles.correct}>
                                    {team.score.fifteenCorrect}
                                </span>
                                /
                                <span className={styles.incorrect}>
                                    {team.score.fifteenIncorrect}
                                </span>
                            </div>
                            <div
                                className={`${martian_mono.className} ${styles.round}`}
                            >
                                Team Questions:{" "}
                                <span className={styles.correct}>
                                    {team.score.totalScore -
                                        team.score.fifteenCorrect * 15 +
                                        team.score.fifteenIncorrect * 15 -
                                        team.score.tenCorrect * 10 +
                                        team.score.tenIncorrect * 10 -
                                        team.score.fiveCorrect * 5 +
                                        team.score.fiveIncorrect * 5 -
                                        100}
                                </span>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default Teams;
