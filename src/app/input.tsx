
import styles from "./page.module.css";

import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { dracula } from "@uiw/codemirror-theme-dracula";

import { useState, useCallback } from "react";

export default function CodeInput(){
    const [value, setValue] = useState(
`{
  "union":{
    "sphere": {
      "color": [0, 0, 0]
    }
  }
}`);

    const onChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
      setValue(val);
    }, []);
    return (
        <div className={styles.codeBlock}>
            <header className={styles.codeInputHeader}></header>
            <CodeMirror value={value} theme={dracula} height="460px" extensions={[json()]} onChange={onChange}></CodeMirror>
        </div>
    )
}