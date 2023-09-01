import styles from "../styles/BuzzedTeam.module.css";

function BuzzedTeam(props) {
    return (
        <div className={styles.buzzedTeamContainer}>
            <h1 className={styles.buzzedTeam}>Buzzed:</h1>
            <div className={styles.buzzedTeamName}>
                Team {props.team.number}: <strong>{props.team.nickname}</strong>
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
