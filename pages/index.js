import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Domine, Raleway } from "next/font/google";
import Link from "next/link";

const domine = Domine({
    subsets: ["latin"],
    display: "swap",
});

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Quiz Bowl Buzzer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.background}></div>

            <h1 className={`${domine.className} ${styles.header}`}>
                Quiz Bowl Buzzer
            </h1>

            <div className={styles.spacer}></div>
            <Link
                href="/join"
                className={`${raleway.className} ${styles.button}`}
            >
                JOIN GAME
            </Link>
            <Link
                href="/create"
                className={`${raleway.className} ${styles.button}`}
            >
                CREATE GAME
            </Link>
            <div className={styles.spacer}></div>
        </div>
    );
}
