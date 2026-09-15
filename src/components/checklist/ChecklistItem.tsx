import type { ChecklistItem as ChecklistItemType } from "../../types/checklist";
import { useState } from "react";
import { ConfirmDialog } from "../common/ConfirmDialog";

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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <>
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
          onClick={() => setIsConfirmingDelete(true)}
          aria-label={`Delete ${item.name}`}
          title={`Delete ${item.name}`}
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </li>
      {isConfirmingDelete ? (
        <ConfirmDialog
          title="Delete checklist item?"
          message={`Are you sure you want to delete “${item.name}”?`}
          confirmLabel="Delete item"
          onConfirm={() => {
            onDelete(item.id);
            setIsConfirmingDelete(false);
          }}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      ) : null}
    </>
  );
}
