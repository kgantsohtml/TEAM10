type Props = {
  className?: string;
};

export function EagleEyeLogo(props: Props) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={props.className}
      role="img"
      aria-label="Eagle Eye"
    >
      <g fill="currentColor">
        <rect x="65" y="65" width="34" height="34" />
        <rect x="103" y="65" width="34" height="34" />
        <rect x="141" y="65" width="34" height="34" />
        <rect x="27" y="103" width="34" height="34" />
        <rect x="65" y="103" width="34" height="34" />
        <rect x="141" y="103" width="34" height="34" />
        <rect x="179" y="103" width="34" height="34" />
        <rect x="65" y="141" width="34" height="34" />
        <rect x="103" y="141" width="34" height="34" />
        <rect x="141" y="141" width="34" height="34" />
      </g>
      <rect x="103" y="103" width="34" height="34" fill="#D4572A" />
    </svg>
  );
}
