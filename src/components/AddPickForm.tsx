"use client";

import { FormEvent, useState } from "react";
import styles from "./AddPickForm.module.css";

export function AddPickForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !link.trim() || !note.trim()) {
      setMessage("FILL REQUIRED");
      return;
    }
    // Phase 1 UI only — real save in Phase 5.
    setMessage("PHASE 1 — NOT SENT");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.heading}>ADD PICK</div>

      <label className={styles.field}>
        <span>TITLE</span>
        <input
          type="text"
          value={title}
          onChange={function (e) {
            setTitle(e.target.value);
          }}
          required
        />
      </label>

      <label className={styles.field}>
        <span>ARTIST</span>
        <input
          type="text"
          value={artist}
          onChange={function (e) {
            setArtist(e.target.value);
          }}
          required
        />
      </label>

      <label className={styles.field}>
        <span>LINK</span>
        <input
          type="url"
          value={link}
          onChange={function (e) {
            setLink(e.target.value);
          }}
          required
        />
      </label>

      <label className={styles.field}>
        <span>NOTE</span>
        <input
          type="text"
          value={note}
          onChange={function (e) {
            setNote(e.target.value);
          }}
          required
        />
      </label>

      <label className={styles.field}>
        <span>COVER (OPTIONAL)</span>
        <input type="file" accept="image/*" />
      </label>

      <button type="submit" className={styles.submit}>
        ADD
      </button>

      {message ? <p className={styles.message}>{message}</p> : null}
    </form>
  );
}
