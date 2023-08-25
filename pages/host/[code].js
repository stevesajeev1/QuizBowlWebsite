import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();
    const code = router.query.code;

    useEffect(() => {
        if (!router.isReady) return;

        hostChannel(code);
    }, [router.isReady]);

    return (
        <>
            <Script
                src="https://js.pusher.com/8.0.1/pusher.min.js"
                strategy="beforeInteractive"
            />
            <Script src="/pusher.js" strategy="beforeInteractive" />

            <h1>Hosting</h1>
            <p>Game: {code}</p>
        </>
    );
}
