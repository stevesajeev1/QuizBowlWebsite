import "../styles/globals.css";

export default function App({ Component, pageProps }) {
    return (
        <Component {...pageProps}>
            <div className="background"></div>
            <div></div>
        </Component>
    );
}
