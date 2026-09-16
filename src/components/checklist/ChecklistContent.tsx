import { Checklist } from "./Checklist";
import { Link } from "react-router-dom";
import type { Situation } from "../../types/checklist";
import { useChecklist } from "../../hooks/useChecklist";

export function ChecklistContent({ situation }: { situation: Situation }) {
  const {
    items,
    addItem,
    deleteItem,
    toggleItem,
    resetChecklist,
    completedCount,
    totalCount,
    progress,
  } = useChecklist(situation.id);

  return (
    <main className="page-shell checklist-page">
      <header className="checklist-header">
        <Link to="/" className="back-link">
          ← Change Situation
        </Link>

        <div className="title-row">
          <span className="situation-badge" aria-hidden="true">
            {situation.icon}
          </span>
          <div>
            <h1>{situation.name}</h1>
            <p>{situation.description}</p>
          </div>
        </div>
      </header>

      <Checklist
        items={items}
        completedCount={completedCount}
        totalCount={totalCount}
        progress={progress}
        onToggle={toggleItem}
        onDelete={deleteItem}
        onAddItem={addItem}
        onReset={resetChecklist}
      />
    </main>
  );
}
