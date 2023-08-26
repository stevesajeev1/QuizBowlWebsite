import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
                <Main />
                <NextScript />
                <Script
                    src="https://js.pusher.com/8.0.1/pusher.min.js"
                    strategy="beforeInteractive"
                ></Script>
                <Script
                    src="/pusher.js"
                    strategy="beforeInteractive"
                ></Script>
            </body>
        </Html>
    );
}
