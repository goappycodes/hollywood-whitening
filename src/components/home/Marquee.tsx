export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden bg-navy py-4 text-white" aria-hidden>
      <div className="flex w-max animate-marquee items-center">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-8 text-xs font-bold tracking-[0.2em] whitespace-nowrap uppercase"
          >
            <span className="size-1.5 rounded-full bg-cyan" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
