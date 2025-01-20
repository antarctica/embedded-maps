function SpinLoader({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      className={className}
      version="1.1"
      viewBox="0 0 85 85"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="gridPattern" width="5" height="5" patternUnits="userSpaceOnUse">
          <g transform="translate(2,2)">
            <rect width="1" height="1" fill="white"></rect>
          </g>
        </pattern>
        <clipPath id="clipCircle">
          <circle cx="50%" cy="50%" r="50%"></circle>
        </clipPath>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#gridPattern)"
        clipPath="url(#clipCircle)"
      ></rect>
      <g fill="white" transform="translate(-12.5,2.5)" id="AntarcticPixels">
        <rect x="48.5" y="18.5" width="3" height="3"></rect>
        <rect x="53.5" y="18.5" width="3" height="3"></rect>
        <rect x="58.5" y="18.5" width="3" height="3"></rect>
        <rect x="63.5" y="18.5" width="3" height="3"></rect>
        <rect x="68.5" y="18.5" width="3" height="3"></rect>
        <rect x="23.5" y="23.5" width="3" height="3"></rect>
        <rect x="48.5" y="23.5" width="3" height="3"></rect>
        <rect x="53.5" y="23.5" width="3" height="3"></rect>
        <rect x="58.5" y="23.5" width="3" height="3"></rect>
        <rect x="63.5" y="23.5" width="3" height="3"></rect>
        <rect x="68.5" y="23.5" width="3" height="3"></rect>
        <rect x="73.5" y="23.5" width="3" height="3"></rect>
        <rect x="78.5" y="23.5" width="3" height="3"></rect>
        <rect x="28.5" y="28.5" width="3" height="3"></rect>
        <rect x="33.5" y="28.5" width="3" height="3"></rect>
        <rect x="48.5" y="28.5" width="3" height="3"></rect>
        <rect x="53.5" y="28.5" width="3" height="3"></rect>
        <rect x="58.5" y="28.5" width="3" height="3"></rect>
        <rect x="63.5" y="28.5" width="3" height="3"></rect>
        <rect x="68.5" y="28.5" width="3" height="3"></rect>
        <rect x="73.5" y="28.5" width="3" height="3"></rect>
        <rect x="78.5" y="28.5" width="3" height="3"></rect>
        <rect x="33.5" y="33.5" width="3" height="3"></rect>
        <rect x="38.5" y="33.5" width="3" height="3"></rect>
        <rect x="43.5" y="33.5" width="3" height="3"></rect>
        <rect x="48.5" y="33.5" width="3" height="3"></rect>
        <rect x="53.5" y="33.5" width="3" height="3"></rect>
        <rect x="58.5" y="33.5" width="3" height="3"></rect>
        <rect x="63.5" y="33.5" width="3" height="3"></rect>
        <rect x="68.5" y="33.5" width="3" height="3"></rect>
        <rect x="73.5" y="33.5" width="3" height="3"></rect>
        <rect x="78.5" y="33.5" width="3" height="3"></rect>
        <rect x="83.5" y="33.5" width="3" height="3"></rect>
        <rect x="33.5" y="38.5" width="3" height="3"></rect>
        <rect x="38.5" y="38.5" width="3" height="3"></rect>
        <rect x="43.5" y="38.5" width="3" height="3"></rect>
        <rect x="48.5" y="38.5" width="3" height="3"></rect>
        <rect x="53.5" y="38.5" width="3" height="3"></rect>
        <rect x="58.5" y="38.5" width="3" height="3"></rect>
        <rect x="63.5" y="38.5" width="3" height="3"></rect>
        <rect x="68.5" y="38.5" width="3" height="3"></rect>
        <rect x="73.5" y="38.5" width="3" height="3"></rect>
        <rect x="78.5" y="38.5" width="3" height="3"></rect>
        <rect x="83.5" y="38.5" width="3" height="3"></rect>
        <rect x="38.5" y="43.5" width="3" height="3"></rect>
        <rect x="43.5" y="43.5" width="3" height="3"></rect>
        <rect x="48.5" y="43.5" width="3" height="3"></rect>
        <rect x="53.5" y="43.5" width="3" height="3"></rect>
        <rect x="58.5" y="43.5" width="3" height="3"></rect>
        <rect x="63.5" y="43.5" width="3" height="3"></rect>
        <rect x="68.5" y="43.5" width="3" height="3"></rect>
        <rect x="73.5" y="43.5" width="3" height="3"></rect>
        <rect x="78.5" y="43.5" width="3" height="3"></rect>
        <rect x="83.5" y="43.5" width="3" height="3"></rect>
        <rect x="38.5" y="48.5" width="3" height="3"></rect>
        <rect x="43.5" y="48.5" width="3" height="3"></rect>
        <rect x="48.5" y="48.5" width="3" height="3"></rect>
        <rect x="63.5" y="48.5" width="3" height="3"></rect>
        <rect x="68.5" y="48.5" width="3" height="3"></rect>
        <rect x="73.5" y="48.5" width="3" height="3"></rect>
        <rect x="78.5" y="48.5" width="3" height="3"></rect>
        <rect x="83.5" y="48.5" width="3" height="3"></rect>
        <rect x="63.5" y="53.5" width="3" height="3"></rect>
        <rect x="68.5" y="53.5" width="3" height="3"></rect>
        <rect x="73.5" y="53.5" width="3" height="3"></rect>
        <rect x="78.5" y="53.5" width="3" height="3"></rect>
        <rect x="63.5" y="58.5" width="3" height="3"></rect>
        <rect x="68.5" y="58.5" width="3" height="3"></rect>
        <rect x="73.5" y="58.5" width="3" height="3"></rect>
      </g>
      <circle
        className="progress-circle"
        cx="50%"
        cy="50%"
        r="49%"
        fill="none"
        stroke="white"
        strokeWidth="2"
      ></circle>
    </svg>
  );
}

export default SpinLoader;
