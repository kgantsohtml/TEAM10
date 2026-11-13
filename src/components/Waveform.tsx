import styles from "./Waveform.module.css";

type Props = {
  values: number[];
};

export function Waveform(props: Props) {
  return (
    <div className={styles.wave} aria-hidden="true">
      {props.values.map(function (value, index) {
        const height = Math.max(2, Math.round(value * 100));
        return (
          <span
            key={index}
            className={styles.bar}
            style={{ height: height + "%" }}
          />
        );
      })}
    </div>
  );
}
