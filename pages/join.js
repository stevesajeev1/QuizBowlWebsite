import Head from "next/head";
import styles from "../styles/Join.module.css";
import { Domine, Raleway, Martian_Mono } from "next/font/google";
import { useRef } from "react";
import { useRouter } from 'next/navigation'

const domine = Domine({
    subsets: ["latin"],
    display: "swap",
});

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

const martianMono = Martian_Mono({
    subsets: ["latin"],
    display: "swap",
});

export default function Join() {
    const router = useRouter();

    const codeRef = useRef(null);
    const nicknameRef = useRef(null);

    const handleJoin = async () => {
        const code = codeRef.current.value.trim();
        const nickname = nicknameRef.current.value.trim();

        const codeRegex = /^[a-zA-Z0-9_\-=@,.;]*$/;
        // Ensure input exists
        if (!code) {
            codeRef.current.setCustomValidity("Enter a code!");
            codeRef.current.reportValidity();
            return;
        }
        if (!codeRegex.test(code)) {
            codeRef.current.setCustomValidity("Enter a valid code!");
            codeRef.current.reportValidity();
            return;
        }
        if (!nickname) {
            nicknameRef.current.setCustomValidity("Enter a nickname!");
            nicknameRef.current.reportValidity();
            return;
        }
        // Navigate to game page
        router.push(`/game/${code}`);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Quiz Bowl Buzzer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.background}></div>

            <h1 className={`${domine.className} ${styles.header}`}>
                Join Game
            </h1>

            <div
                className={`${raleway.className} ${styles.inputContainer}`}
                style={{ marginTop: 100 }}
            >
                GAME CODE:
                <input
                    className={`${martianMono.className}`}
                    ref={codeRef}
                ></input>
            </div>
            <div className={`${raleway.className} ${styles.inputContainer}`}>
                NICKNAME:
                <input
                    className={`${martianMono.className}`}
                    ref={nicknameRef}
                ></input>
            </div>
            <div className={styles.spacer}></div>

            <div
                className={`${raleway.className} ${styles.button} ${styles.joinButton}`}
                onClick={handleJoin}
            >
                JOIN
            </div>
        </div>
    );
}
