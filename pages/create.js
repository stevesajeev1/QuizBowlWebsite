import Head from "next/head";
import styles from "../styles/Create.module.css";
import { Domine, Raleway, Martian_Mono } from "next/font/google";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

export default function Create() {
    const router = useRouter();

    const codeRef = useRef(null);

    const handleCreate = async () => {
        const code = codeRef.current.value.trim();

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

        // Determine if game with code already exists
        const exists = await fetch("/api/channels-exist", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: code,
        });

        if (exists.ok) {
            // Game with code already exists
            codeRef.current.setCustomValidity(
                "A game with this code is already in use!"
            );
            codeRef.current.reportValidity();
            return;
        } else {
            // Create game
            router.push(`/host/${code}`);
        }
    };

    return (
        <div className="container">
            <Head>
                <title>Create Game</title>
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
                Create Game
            </h1>

            <div className={styles.spacer}></div>
            <div className={`${raleway.className} ${styles.inputContainer}`}>
                GAME CODE:
                <input
                    className={`${martianMono.className}`}
                    ref={codeRef}
                    onKeyDown={(e) => {
                        e.key == "Enter" && handleCreate()
                    }}
                ></input>
            </div>
            <div className={styles.spacer}></div>

            <div
                className={`${raleway.className} ${styles.button} ${styles.joinButton}`}
                onClick={handleCreate}
            >
                CREATE
            </div>
        </div>
    );
}
