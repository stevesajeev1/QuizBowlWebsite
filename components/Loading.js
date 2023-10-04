import styles from "../styles/Loading.module.css";

function Loading(props) {
    return (
        <span
            className={`${styles.loader} ${
                props.visible ? styles.visible : ""
            }`}
        ></span>
    );
}

export default Loading;