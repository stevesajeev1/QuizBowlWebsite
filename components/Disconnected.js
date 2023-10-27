import Image from "next/image";
import styles from "../styles/Disconnected.module.css";

function Disconnected() {
    return (
        <div className={styles.disconnected}>
            <Image
                className={styles.disconnectIcon}
                src="/disconnect.svg"
                width={32}
                height={32}
                alt="Disconnected"
            />
            Currently disconnected! Trying to reconnect...
        </div>
    );
}

export default Disconnected;
