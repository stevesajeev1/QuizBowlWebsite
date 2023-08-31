import { Domine } from "next/font/google";
import styles from "../styles/Buzzer.module.css";
import { useState, useEffect, useRef } from "react";

const domine = Domine({
    subsets: ["latin"],
    display: "swap",
});

function Buzzer(props) {
    const [buzzed, setBuzzed] = useState(props.buzzed);

    const buzzedRef = useRef();
    buzzedRef.current = buzzed;

    const handleBuzz = () => {
        if (buzzedRef.current == "buzzed" || buzzedRef.current == "disabled") {
            return;
        }

        props.handleBuzz();
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key == " ") {
                handleBuzz();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    useEffect(() => {
        setBuzzed(props.buzzed);
    }, [props.buzzed]);

    return (
        <div
            className={`${domine.className} ${styles.buzzer} ${
                buzzed == "buzzed" ? styles.buzzed : (buzzed == "disabled" ? styles.disabled : styles.notBuzzed)
            }`}
            onClick={handleBuzz}
        >
            {buzzed == "buzzed" ? "BUZZED" : (buzzed == "disabled" ? "DISABLED" : "BUZZ")}
        </div>
    );
}

export default Buzzer;
