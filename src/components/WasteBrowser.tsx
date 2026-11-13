"use client";

import { useEffect, useMemo, useState } from "react";
import { Pick, PickSource, Track } from "@/types";
import { getPickDisplay } from "@/lib/pick-display";
import { PickRow } from "./PickRow";
import { PickDetail } from "./PickDetail";
import { AddPickForm } from "./AddPickForm";
import styles from "./WasteBrowser.module.css";

type SourceTab = "ALL" | PickSource;

type Props = {
  picks: Pick[];
  tracksById: Record<string, Track>;
  onAirCode: string;
};

export function WasteBrowser(props: Props) {
  const [source, setSource] = useState<SourceTab>("ALL");
  const [manager, setManager] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(function () {
    function check() {
      setIsMobile(window.innerWidth < 720);
    }
    check();
    window.addEventListener("resize", check);
    return function () {
      window.removeEventListener("resize", check);
    };
  }, []);

  const managers = useMemo(function () {
    const set: Record<string, boolean> = {};
    props.picks.forEach(function (p) {
      set[p.picked_by] = true;
    });
    return Object.keys(set).sort();
  }, [props.picks]);

  const visible = props.picks.filter(function (p) {
    if (source !== "ALL" && p.source !== source) return false;
    if (manager && p.picked_by !== manager) return false;
    return true;
  });

  const firstId = visible.length > 0 ? visible[0].id : "";
  let activeId = firstId;
  visible.forEach(function (p) {
    if (p.id === selectedId) activeId = selectedId;
  });

  const selectedPick = visible.find(function (p) {
    return p.id === activeId;
  });

  const selectedDisplay = selectedPick
    ? getPickDisplay(selectedPick, props.tracksById, props.onAirCode)
    : undefined;

  const tabs: SourceTab[] = ["ALL", "BIN", "SPOTIFY", "APPLE"];

  return (
    <div>
      <p className={styles.blurb}>
        Picks from the owner and managers. Spotify and Apple are links only.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label="source">
          {tabs.map(function (tab) {
            const active = source === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                className={
                  active ? styles.tab + " " + styles.tabActive : styles.tab
                }
                onClick={function () {
                  setSource(tab);
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className={styles.managers} aria-label="managers">
          <button
            type="button"
            className={
              manager === ""
                ? styles.tag + " " + styles.tagActive
                : styles.tag
            }
            onClick={function () {
              setManager("");
            }}
          >
            ALL
          </button>
          {managers.map(function (name) {
            const active = manager === name;
            return (
              <button
                key={name}
                type="button"
                className={
                  active ? styles.tag + " " + styles.tagActive : styles.tag
                }
                onClick={function () {
                  setManager(active ? "" : name);
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.list}>
          {visible.map(function (pick, index) {
            const display = getPickDisplay(
              pick,
              props.tracksById,
              props.onAirCode
            );
            return (
              <PickRow
                key={pick.id}
                display={display}
                selected={!isMobile && pick.id === activeId}
                stripe={index % 2 === 1}
                href={isMobile ? "/waste/" + pick.id : undefined}
                onSelect={
                  isMobile
                    ? undefined
                    : function () {
                        setSelectedId(pick.id);
                      }
                }
              />
            );
          })}
          {visible.length === 0 ? (
            <div className={styles.empty}>NONE</div>
          ) : null}
        </div>

        {!isMobile && selectedDisplay ? (
          <PickDetail display={selectedDisplay} />
        ) : null}
      </div>

      <AddPickForm />
    </div>
  );
}
