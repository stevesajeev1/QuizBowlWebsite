import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Page() {
    const router = useRouter();

    const [code, setCode] = useState("");

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);

        hostChannel(code);
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>Quiz Bowl Buzzer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>Hosting</h1>
            <p>Game: {code}</p>
        </>
    );
}
