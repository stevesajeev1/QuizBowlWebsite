import { Raleway } from "next/font/google";
import styles from "../styles/Buttons.module.css";
import { useState } from "react";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

function Buttons(props) {
    const [fiveSelected, setFiveSelected] = useState(false);
    const [tenSelected, setTenSelected] = useState(false);
    const [fifteenSelected, setFifteenSelected] = useState(false);
    const [teamQuestionsSelected, setTeamQuestionsSelected] = useState(false);

    const handleClick = (round) => {
        switch (round) {
            case 5:
                setFiveSelected(!fiveSelected);
                setTenSelected(false);
                setFifteenSelected(false);
                setTeamQuestionsSelected(false);

                if (!fiveSelected) {
                    props.startRound(`${round} Point Round`);
                } else {
                    props.startRound("");
                }
                break;
            case 10:
                setFiveSelected(false);
                setTenSelected(!tenSelected);
                setFifteenSelected(false);
                setTeamQuestionsSelected(false);

                if (!tenSelected) {
                    props.startRound(`${round} Point Round`);
                } else {
                    props.startRound("");
                }
                break;
            case 15:
                setFiveSelected(false);
                setTenSelected(false);
                setFifteenSelected(!fifteenSelected);
                setTeamQuestionsSelected(false);

                if (!fifteenSelected) {
                    props.startRound(`${round} Point Round`);
                } else {
                    props.startRound("");
                }
                break;
            case "teamquestions":
                setFiveSelected(false);
                setTenSelected(false);
                setFifteenSelected(false);
                setTeamQuestionsSelected(!teamQuestionsSelected);

                if (!teamQuestionsSelected) {
                    props.startRound("Team Questions");
                } else {
                    props.startRound("");
                }
                break;
        }
    };

    return (
        <div className={`${raleway.className} ${styles.buttons}`}>
            <div
                className={styles.button}
                onClick={() => {
                    props.startRound("Buzzer Check");
                    props.buzzerCheck();
                }}
            >
                Buzzer Check
            </div>
            <div
                className={`${styles.button} ${
                    fiveSelected ? styles.selected : ""
                }`}
                onClick={() => {
                    handleClick(5);
                }}
            >
                {fiveSelected ? "Stop" : "Start"} 5 Point Round
            </div>
            <div
                className={`${styles.button} ${
                    tenSelected ? styles.selected : ""
                }`}
                onClick={() => {
                    handleClick(10);
                }}
            >
                {tenSelected ? "Stop" : "Start"} 10 Point Round
            </div>
            <div
                className={`${styles.button} ${
                    fifteenSelected ? styles.selected : ""
                }`}
                onClick={() => {
                    handleClick(15);
                }}
            >
                {fifteenSelected ? "Stop" : "Start"} 15 Point Round
            </div>
            <div
                className={`${styles.button} ${
                    teamQuestionsSelected ? styles.selected : ""
                }`}
                onClick={() => {
                    handleClick("teamquestions");
                }}
            >
                {teamQuestionsSelected ? "Stop" : "Start"} Team Questions
            </div>
        </div>
    );
}

export default Buttons;
