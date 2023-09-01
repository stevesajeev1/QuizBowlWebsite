import { useEffect, useState } from "react";
import styles from "../styles/BuzzerCheck.module.css";
import { Raleway } from "next/font/google";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

function BuzzerCheck(props) {
    const [teams, setTeams] = useState(props.teams);
    const [buzzerChecked, setBuzzerChecked] = useState(props.buzzerChecked);

    useEffect(() => {
        props.teams.sort((a, b) => {
            return new Date(a.joinTime) - new Date(b.joinTime);
        });

        props.teams.forEach((t) => (t.checked = false));

        setTeams(props.teams);
    }, [props.teams]);

    useEffect(() => {
        setBuzzerChecked(props.buzzerChecked);
    }),
        [props.buzzerChecked];

    return (
        <div className={styles.container}>
            <div className={styles.teams}>
                {teams.map((team, index) => {
                    return (
                        <div
                            key={index}
                            className={`${styles.teamContainer} ${
                                buzzerChecked.includes(team.id)
                                    ? styles.checked
                                    : styles.notChecked
                            }`}
                        >
                            <div
                                className={`${raleway.className} ${styles.teamName}`}
                            >
                                Team {index + 1}:{" "}
                                <strong>{team.nickname}</strong>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BuzzerCheck;
