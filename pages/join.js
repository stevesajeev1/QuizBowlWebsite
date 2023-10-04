import Head from "next/head";
import styles from "../styles/Join.module.css";
import { Domine, Raleway, Martian_Mono } from "next/font/google";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loading from "../components/Loading";

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

    const [loading, showLoading] = useState(false);

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

        showLoading(true);
        // Determine if game with code exists
        const codeExists = await fetch("/api/channels-exist", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: code,
        });

        if (!codeExists.ok) {
            // Code does not exist
            codeRef.current.setCustomValidity(
                "A game with this code does not exist!"
            );
            codeRef.current.reportValidity();
            showLoading(false);
            return;
        }

        const nicknameExists = await nicknameInUse(code, nickname);
        showLoading(false);

        if (nicknameExists) {
            // Nickname in use
            nicknameRef.current.setCustomValidity(
                "This nickname is already in use in this game!"
            );
            nicknameRef.current.reportValidity();
            return;
        }

        router.push({
            pathname: `/game/${code}`,
            query: {
                nickname: nickname,
            },
        });
    };

    return (
        <div className="container">
            <Head>
                <title>Join Game</title>
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
                    onKeyDown={(e) => {
                        e.key == "Enter" && handleJoin();
                    }}
                ></input>
            </div>
            <div className={`${raleway.className} ${styles.inputContainer}`}>
                NICKNAME:
                <input
                    className={`${martianMono.className}`}
                    ref={nicknameRef}
                    onKeyDown={(e) => {
                        e.key == "Enter" && handleJoin();
                    }}
                ></input>
            </div>
            <div className={styles.spacer}></div>

            <div className={styles.buttonContainer}>
                <div
                    className={`${raleway.className} ${styles.button} ${styles.joinButton}`}
                    onClick={handleJoin}
                >
                    JOIN
                </div>
                <Loading visible={loading} />
            </div>
        </div>
    );
}
