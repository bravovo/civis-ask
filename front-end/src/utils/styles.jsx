export function TypographyH1(text) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
      {text}
    </h1>
  );
}

export function TypographyH2(text) {
  return (
    <h2 className="scroll-m-20 text-lg md:text-3xl font-semibold tracking-tight first:mt-0">
      {text}
    </h2>
  );
}

export function TypographyH3(text) {
  return (
    <h3 className="scroll-m-20 text-sm md:text-2xl font-semibold tracking-tight">
      {text}
    </h3>
  );
}

export function TypographyLarge(text) {
  return <div className="text-[14px] md:text-lg font-semibold">{text}</div>;
}

export function TypographyLead(text, color = "text-muted-foreground") {
  return <p className={`text-lg md:text-xl ${color}`}>{text}</p>;
}

export function TypographyP(text) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{text}</p>;
}
