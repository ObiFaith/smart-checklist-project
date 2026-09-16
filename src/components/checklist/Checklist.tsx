import { AddItemForm } from "./AddItemForm";
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistProgress } from "./ChecklistProgress";
import type { ChecklistProps } from "../../types/checklist";

export function Checklist({
  items,
  completedCount,
  totalCount,
  progress,
  onToggle,
  onDelete,
  onAddItem,
  onReset,
}: ChecklistProps) {
  return (
    <section className="checklist-panel">
      <ChecklistProgress
        completedCount={completedCount}
        totalCount={totalCount}
        progress={progress}
      />

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your checklist is empty.</p>
          <p>Add something you don&apos;t want to forget.</p>
        </div>
      ) : (
        <ul className="checklist-list">
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      <AddItemForm onAddItem={onAddItem} />

      <button type="button" className="secondary-button" onClick={onReset}>
        Reset Checklist
      </button>
    </section>
  );
}
