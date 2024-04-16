
import styles from "../styles/page.module.css";

import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { dracula } from "@uiw/codemirror-theme-dracula";

import { useCallback } from "react";

interface props{
  value: string,
  setValue: (val: string) => void;
}

export default function CodeInput(props: props){
    const onChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
      props.setValue(val);
    }, []);
    return (
        <div className={styles.codeBlock}>
            <header className={styles.codeInputHeader}></header>
            <CodeMirror value={props.value} theme={dracula} height="660px" extensions={[json()]} onChange={onChange}></CodeMirror>
        </div>
    )
}