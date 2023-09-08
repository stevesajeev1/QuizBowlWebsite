import styles from "../styles/BuzzedTeam.module.css";
import Image from "next/image";

function BuzzedTeam(props) {
    return (
        <div className={styles.buzzedTeamContainer}>
            <Image
                className={styles.close}
                src="/close.svg"
                width={32}
                height={32}
                alt="Close"
                onClick={() => {
                    props.dismissBuzz();
                }}
            />
            <h1 className={styles.buzzedTeam}>Buzzed:</h1>
            <div className={styles.buzzedTeamName}>
                Team {props.team.number}:{" "}
                <strong>
                    {props.team.nickname.slice(0, 20) +
                        (props.team.nickname.length > 20 ? "..." : "")}
                </strong>
            </div>
            <div className={styles.buttons}>
                <div
                    className={`${styles.button} ${styles.correct}`}
                    onClick={props.correctResponse}
                >
                    Correct
                </div>
                <div
                    className={`${styles.button} ${styles.incorrect}`}
                    onClick={props.incorrectResponse}
                >
                    Incorrect
                </div>
            </div>
        </div>
    );
}

export default BuzzedTeam;
