interface CharacterCounterProps {
  current: number;
  max: number;
}

export const CharacterCounter = ({ current, max }: CharacterCounterProps) => {
  const isNearLimit = current >= max - 500;
  const isAtLimit = current >= max;

  let colorClass = 'text-[var(--text-muted)]';
  if (isAtLimit) {
    colorClass = 'text-red-500 font-semibold';
  } else if (isNearLimit) {
    colorClass = 'text-amber-500 font-medium';
  }

  return (
    <span className={`text-xs font-mono transition-colors duration-200 ${colorClass}`} aria-live="polite">
      {current} / {max}
    </span>
  );
};

export default CharacterCounter;
