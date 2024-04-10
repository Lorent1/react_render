"use client"
import { useRef, useEffect, useState } from "react";
import styles from "./page.module.css";
import CodeInput from "./input";
import RenderBox from "./renderBox";

export default function Home() {

  return (
    <main className={styles.main}>
      <CodeInput></CodeInput>
      <RenderBox></RenderBox>
    </main>
  );
}
