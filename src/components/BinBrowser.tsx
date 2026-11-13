"use client";

import { useMemo, useState } from "react";
import { Track, SortMode } from "@/types";
import { TrackGrid } from "./TrackGrid";
import styles from "./BinBrowser.module.css";

type Props = {
  tracks: Track[];
  onAirCode: string;
};

export function BinBrowser(props: Props) {
  const [query, setQuery] = useState("");
  const [feeling, setFeeling] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [randomSeed, setRandomSeed] = useState(1);

  const feelings = useMemo(function () {
    const set: Record<string, boolean> = {};
    props.tracks.forEach(function (t) {
      set[t.feeling] = true;
    });
    return Object.keys(set).sort();
  }, [props.tracks]);

  const visible = useMemo(
    function () {
      let list = props.tracks.slice();

      const q = query.trim().toLowerCase();
      if (q) {
        list = list.filter(function (t) {
          return (
            t.title.toLowerCase().indexOf(q) !== -1 ||
            t.credit_name.toLowerCase().indexOf(q) !== -1
          );
        });
      }

      if (feeling) {
        list = list.filter(function (t) {
          return t.feeling === feeling;
        });
      }

      if (sort === "newest") {
        list.sort(function (a, b) {
          return a.created_at < b.created_at ? 1 : -1;
        });
      } else if (sort === "most_liked") {
        list.sort(function (a, b) {
          return b.likes - a.likes;
        });
      } else {
        list.sort(function (a, b) {
          return hash(a.id + randomSeed) - hash(b.id + randomSeed);
        });
      }

      return list;
    },
    [props.tracks, query, feeling, sort, randomSeed]
  );

  return (
    <div>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="SEARCH"
          value={query}
          onChange={function (e) {
            setQuery(e.target.value);
          }}
          aria-label="search"
        />

        <select
          className={styles.select}
          value={feeling}
          onChange={function (e) {
            setFeeling(e.target.value);
          }}
          aria-label="feeling"
        >
          <option value="">FEELING</option>
          {feelings.map(function (f) {
            return (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            );
          })}
        </select>

        <select
          className={styles.select}
          value={sort}
          onChange={function (e) {
            setSort(e.target.value as SortMode);
          }}
          aria-label="sort"
        >
          <option value="newest">NEWEST</option>
          <option value="most_liked">MOST LIKED</option>
          <option value="random">RANDOM</option>
        </select>

        <button
          type="button"
          className={styles.random}
          onClick={function () {
            setSort("random");
            setRandomSeed(randomSeed + 1);
          }}
        >
          RANDOM
        </button>
      </div>

      <TrackGrid tracks={visible} onAirCode={props.onAirCode} />
    </div>
  );
}

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) % 100000;
  }
  return h;
}
