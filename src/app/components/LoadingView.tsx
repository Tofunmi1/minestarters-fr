export default function LoadingView() {
  const size = 143;
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;

  const arcLength = circumference * 0.25;
  const gapLength = circumference - arcLength;

  return (
    <div className="spinner-wrap">
      <svg
        className="spinner-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#0D2A25"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#70CCB0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${gapLength}`}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
    </div>
  );
}
