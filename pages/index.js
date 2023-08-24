import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Script from 'next/script';
import { Domine, Raleway } from 'next/font/google';

const domine = Domine({
  subsets: ['latin'],
  display: 'swap'
});

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap'
});

const handleJoin = () => {
  const code = prompt("Enter game code: ");
  subscribeChannel(code);
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Quiz Bowl Buzzer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script src="https://js.pusher.com/8.0.1/pusher.min.js" strategy="beforeInteractive" />
      <Script src="/pusher.js" strategy="beforeInteractive"/>

      <div className={styles.background}></div>

      <h1 className={`${domine.className} ${styles.header}`}>Quiz Bowl Buzzer</h1>

      <div className={styles.spacer}></div>
      <div className={`${raleway.className} ${styles.button}`} onClick={handleJoin}>JOIN GAME</div>
      <div className={`${raleway.className} ${styles.button}`}>CREATE GAME</div>
      <div className={styles.spacer}></div>

    </div>
  )
}
