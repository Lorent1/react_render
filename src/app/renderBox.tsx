import styles from "./page.module.css";
import MyCanvas from "./canvas";
import { useRef } from "react";

export default function RenderBox(){
    
    function render(){
        console.log("s")
    }

    return(
        <div className={styles.renderBox}>
            <header className={styles.renderBoxHeader}>
                <button className={styles.renderButton} onClick={render}>Render!</button>
            </header>
            <MyCanvas width={400} height={400}></MyCanvas>
        </div>  
    )
}