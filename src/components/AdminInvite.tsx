"use client";

import { useState } from "react";
import styles from "./AdminInvite.module.css";

export function AdminInvite() {
  const [code, setCode] = useState("");

  function generate() {
    // Phase 1 placeholder — real codes come from Supabase in Phase 5.
    const fake = "INV-" + Math.floor(Math.random() * 9000 + 1000);
    setCode(fake);
  }

  return (
    <div className={styles.box}>
      <button type="button" className={styles.btn} onClick={generate}>
        MAKE CODE
      </button>
      {code ? <div className={styles.code}>{code}</div> : null}
      <p className={styles.note}>PHASE 1 — NOT SAVED</p>
    </div>
  );
}
