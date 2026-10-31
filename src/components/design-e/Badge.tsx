/** Round "free training" seal with slowly rotating text. Decorative: the page says the same in words. */
export function Badge({ className = "" }: { className?: string }) {
  const text = "Free training · With every package · ";
  return (
    <div aria-hidden className={`hd-float grid size-28 place-items-center !rounded-full sm:size-32 ${className}`}>
      <svg viewBox="0 0 120 120" className="he-badge absolute inset-0 size-full">
        <defs>
          <path id="he-badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <text fontSize="11.2" fontWeight="600" letterSpacing="0.35" fill="#17152b">
          <textPath href="#he-badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="he-numeral !text-[2.4rem]">✦</span>
    </div>
  );
}
