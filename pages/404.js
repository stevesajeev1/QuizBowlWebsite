import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Custom404.module.css";
import { Raleway } from "next/font/google";

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
});

export default function Custom404() {
    return (
        <div className={`container ${styles.container}`}>
            <Head>
                <title>Page Not Found</title>
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

            <h1 className={`${raleway.className} ${styles.message}`}>404 - Page/Game Not Found</h1>
        </div>
    )
}