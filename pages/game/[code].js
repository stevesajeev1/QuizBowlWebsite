import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);
        const nickname = router.query.nickname;
        setNickname(nickname);

        joinChannel(code, nickname);
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

            <h1>Regular</h1>
            <p>Game: {code}</p>
            <p>Nickname: {nickname}</p>
        </div>
    );
}
