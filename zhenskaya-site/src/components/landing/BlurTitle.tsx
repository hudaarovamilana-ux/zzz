type BlurZone = "start" | "mid" | "end";

function SoftBlurWord({ text, zones }: { text: string; zones: BlurZone[] }) {
  const zoneClass: Record<BlurZone, string> = {
    start: "blur-text-soft-start",
    mid: "blur-text-soft-mid",
    end: "blur-text-soft-end",
  };

  return (
    <span className="relative inline-block">
      <span className="relative z-10">{text}</span>
      {zones.map((zone) => (
        <span
          key={zone}
          aria-hidden
          className={`absolute inset-0 blur-text-soft ${zoneClass[zone]} pointer-events-none`}
        >
          {text}
        </span>
      ))}
    </span>
  );
}

/** Чёткие буквы в начале слова — как «ЖЕ» в «Женская» */
function CrispLetters({ text }: { text: string }) {
  return <span className="relative z-10">{text}</span>;
}

export function BlurTitle() {
  return (
    <div className="relative select-none">
      <h1 className="text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tight text-rose-muted uppercase">
        <span className="block">
          <SoftBlurWord text="Женская" zones={["mid", "end"]} />
        </span>
        <span className="block mt-1">
          <SoftBlurWord text="консульта" zones={["start", "mid"]} />
          <CrispLetters text="ция" />
        </span>
      </h1>
    </div>
  );
}
