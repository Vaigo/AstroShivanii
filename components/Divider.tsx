interface DividerProps {
  symbol?: string;
}

export default function Divider({ symbol = "✦" }: DividerProps) {
  return (
    <div className="ornament-divider" role="separator" aria-hidden="true">
      <span className="ornament-divider-symbol">{symbol}</span>
    </div>
  );
}
