"use client"
import { useRef, useEffect, useState } from "react";
import styles from "./styles/page.module.css";
import CodeInput from "./components/input";
import RenderBox from "./components/renderBox";
import Image from 'next/image';
import github_logo from "../github_logo.svg";

let rawdata = require('../scene.json');
import json from "../scene.json"
import Modal from "./components/modal";


export default function Home() {

  const [value, setValue] = useState(JSON.stringify(json, null, 2));
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState("");

  function showErrorModal(err: string){
    setText(err);
    setOpen(true)
  }

  function closeModal(){
    setOpen(false);
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <CodeInput value={value} setValue={setValue}></CodeInput>
        <RenderBox json={value} showErrorModal={showErrorModal}></RenderBox>
      </div>
      {isOpen ? <Modal text = {text} color="red" closeModal={closeModal}></Modal> : null}
      <footer className={styles.footer}>
        <Image style={{marginRight: 10}} src={github_logo} alt="github" width={36} height={36}></Image>
        <p>You can see full code of this project on  
          <a href="https://github.com/Lorent1" target="_blank" title="github.com/Lorent1" style={{color:"#9d4edd"}}> github</a>
        </p>
      </footer>
    </main>
  );
}
