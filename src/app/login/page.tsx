"use client";

import { FormEvent, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState("");
  const [message, setMessage] = useState("");

  function onLogin(e: FormEvent) {
    e.preventDefault();
    setMessage("PHASE 1 — AUTH LATER");
  }

  function onInvite(e: FormEvent) {
    e.preventDefault();
    setMessage("PHASE 1 — INVITE LATER");
  }

  return (
    <main className="page">
      <h1 className="page-title">LOGIN</h1>
      <p className={styles.note}>OWNER AND MANAGERS ONLY</p>

      <form className={styles.form} onSubmit={onLogin}>
        <label className={styles.field}>
          <span>EMAIL</span>
          <input
            type="email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
            required
          />
        </label>
        <label className={styles.field}>
          <span>PASSWORD</span>
          <input
            type="password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
            required
          />
        </label>
        <button type="submit" className={styles.btn}>
          ENTER
        </button>
      </form>

      <form className={styles.form} onSubmit={onInvite}>
        <label className={styles.field}>
          <span>INVITE CODE</span>
          <input
            type="text"
            value={invite}
            onChange={function (e) {
              setInvite(e.target.value);
            }}
            required
          />
        </label>
        <button type="submit" className={styles.btn}>
          JOIN
        </button>
      </form>

      {message ? <p className={styles.message}>{message}</p> : null}
    </main>
  );
}
