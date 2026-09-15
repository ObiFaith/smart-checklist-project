import type { ChecklistItem as ChecklistItemType } from "../../types/checklist";

type ChecklistItemProps = {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ChecklistItem({
  item,
  onToggle,
  onDelete,
}: ChecklistItemProps) {
  return (
    <li className="checklist-item">
      <label className="check-row">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          aria-label={
            item.completed
              ? `Mark ${item.name} as incomplete`
              : `Mark ${item.name} as complete`
          }
        />
        <span className={`item-name ${item.completed ? "completed" : ""}`}>
          {item.name}
        </span>
      </label>
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(item.id)}
        aria-label={`Delete ${item.name}`}
        title={`Delete ${item.name}`}
      >
        <span aria-hidden="true">🗑️</span>
      </button>
    </li>
  );
}
