type ChecklistProgressProps = {
  completedCount: number;
  totalCount: number;
  progress: number;
};

export function ChecklistProgress({
  completedCount,
  totalCount,
  progress,
}: ChecklistProgressProps) {
  return (
    <div className="progress-block" aria-live="polite">
      <div className="progress-header">
        <span>
          {completedCount} of {totalCount} completed
        </span>
      </div>
      <div className="progress-bar" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
