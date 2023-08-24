import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Script from 'next/script';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script src="https://js.pusher.com/8.0.1/pusher.min.js" strategy="beforeInteractive" />
      <Script src="/pusher.js" strategy="beforeInteractive"/>

      <button onClick={() => {pushData("test")}}></button>

    </div>
  )
}
