import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Raleway } from "next/font/google";
import Teams from "../../components/Teams";
import styles from "../../styles/Game.module.css";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

export default function Page() {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");
    const [teams, setTeams] = useState([]);

    const gameUpdate = (updatedTeams) => {
        setTeams(updatedTeams);
    }

    const kick = () => {
        router.push("/");
    }

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);
        const nickname = router.query.nickname;
        setNickname(nickname);

        joinChannel(code, nickname, gameUpdate, kick);
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

            <div className={styles.gameContainer}>
                <header className={raleway.className}>
                    <h1 className={styles.code}>
                        GAME CODE: <strong>{code}</strong>
                    </h1>
                    <h1 className={styles.nickname}>CURRENT TEAM: <strong>{nickname}</strong></h1>
                </header>
                <hr className={styles.line}></hr>
                <div className={styles.mainContainer}>
                    <div className={styles.settingsContainer}></div>
                    <Teams teams={teams} host={false} />
                </div>
            </div>
        </div>
    );
}
