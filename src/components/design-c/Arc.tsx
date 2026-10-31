import { useId } from "react";

/**
 * The Arc: the concept's signature. A smile-shaped line of light, drawn in the colours
 * passed in (by default the machine's purple, blue and red). `intensity` dims the glow.
 */
export function Arc({
  colors = ["#8a4dff", "#3d7bff", "#ff4257"],
  intensity = 1,
  stroke = 5,
  className,
}: {
  colors?: string[];
  intensity?: number;
  stroke?: number;
  className?: string;
}) {
  const id = useId();
  const stops = colors.length > 1 ? colors : [colors[0], colors[0]];
  const path = "M12 12 C 170 178, 430 178, 588 12";

  return (
    <svg viewBox="0 0 600 150" fill="none" aria-hidden className={className} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" x2="600" y1="0" y2="0">
          {stops.map((color, i) => (
            <stop key={`${color}${i}`} offset={i / (stops.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
        <filter id={`${id}-b`} filterUnits="userSpaceOnUse" x="-60" y="-80" width="720" height="320">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <path d={path} stroke={`url(#${id}-g)`} strokeWidth={stroke * 5} strokeLinecap="round" filter={`url(#${id}-b)`} opacity={intensity} />
      <path d={path} stroke={`url(#${id}-g)`} strokeWidth={stroke} strokeLinecap="round" opacity={0.25 + intensity * 0.75} />
      <path d={path} stroke="#fff" strokeWidth={stroke * 0.3} strokeLinecap="round" opacity={intensity * 0.9} />
    </svg>
  );
}
