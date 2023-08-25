import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

export default function Page() {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;

        const code = router.query.code;
        setCode(code);
    }, [router.isReady]);

    useEffect(() => {
        if (scriptLoaded && code) {
            hostChannel(code);
        }
    }, [code, scriptLoaded]);

    return (
        <>
            <Head>
                <title>Quiz Bowl Buzzer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Script
                src="https://js.pusher.com/8.0.1/pusher.min.js"
                strategy="afterInteractive"
            ></Script>
            <Script
                src="/pusher.js"
                strategy="afterInteractive"
                onLoad={() => {
                    setScriptLoaded(true);
                }}
            ></Script>

            <h1>Hosting</h1>
            <p>Game: {code}</p>
        </>
    );
}
