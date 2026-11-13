"use client";

import { FormEvent, useState } from "react";
import { TAKEDOWN_EMAIL } from "@/config";
import styles from "./UploadForm.module.css";

export function UploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feeling, setFeeling] = useState("");
  const [credit, setCredit] = useState("");
  const [link, setLink] = useState("");
  const [download, setDownload] = useState(false);
  const [rights, setRights] = useState(false);
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rights) {
      setMessage("RIGHTS REQUIRED");
      return;
    }
    if (!title.trim() || !credit.trim() || !feeling.trim()) {
      setMessage("FILL REQUIRED");
      return;
    }
    // Phase 1: UI only — no upload yet.
    setMessage("PHASE 1 — NOT SENT");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>AUDIO MP3</span>
        <input type="file" accept="audio/mpeg,.mp3" required />
      </label>

      <label className={styles.field}>
        <span>COVER</span>
        <input type="file" accept="image/*" required />
      </label>

      <label className={styles.field}>
        <span>TITLE</span>
        <input
          type="text"
          maxLength={60}
          value={title}
          onChange={function (e) {
            setTitle(e.target.value);
          }}
          required
        />
      </label>

      <label className={styles.field}>
        <span>DESCRIPTION</span>
        <textarea
          maxLength={200}
          rows={3}
          value={description}
          onChange={function (e) {
            setDescription(e.target.value);
          }}
        />
      </label>

      <label className={styles.field}>
        <span>FEELING</span>
        <input
          type="text"
          maxLength={24}
          value={feeling}
          onChange={function (e) {
            setFeeling(e.target.value);
          }}
          placeholder="3am drive"
          required
        />
      </label>

      <label className={styles.field}>
        <span>CREDIT</span>
        <input
          type="text"
          value={credit}
          onChange={function (e) {
            setCredit(e.target.value);
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
        />
      </label>

      <label className={styles.check}>
        <input
          type="checkbox"
          checked={download}
          onChange={function (e) {
            setDownload(e.target.checked);
          }}
        />
        <span>ALLOW DOWNLOAD</span>
      </label>

      <label className={styles.check}>
        <input
          type="checkbox"
          checked={rights}
          onChange={function (e) {
            setRights(e.target.checked);
          }}
          required
        />
        <span>I MADE THIS OR HAVE PERMISSION TO SHARE IT.</span>
      </label>

      <button type="submit" className={styles.submit}>
        DUMP
      </button>

      {message ? <p className={styles.message}>{message}</p> : null}

      <p className={styles.note}>
        STREAM ONLY UNLESS DOWNLOAD IS ALLOWED. TAKEDOWN: {TAKEDOWN_EMAIL}
      </p>
    </form>
  );
}
