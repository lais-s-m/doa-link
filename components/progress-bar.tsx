export function ProgressBar({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  const percent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div
      className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-emerald-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
