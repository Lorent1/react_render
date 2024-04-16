import styles from "../styles/page.module.css";

interface props{
    text: string;
    color: string;
    closeModal: () => void;
}

export default function Modal(props: props){
    return <div className={styles.modal}>
        <div className={styles.modalInner}>
            <header className={styles.modalInnerHeader}>
                <button className={styles.close} onClick={props.closeModal}>✕</button>
            </header>
            <div className={styles.modalText} style={{color: props.color}}><p>{props.text}</p></div>
        </div>
    </div>
}