import { Link, Navigate, useParams } from "react-router-dom";
import { Checklist } from "../components/checklist/Checklist";
import { getSituationById } from "../data/situations";
import { useChecklist } from "../hooks/useChecklist";
import type { Situation } from "../types/checklist";

export function ChecklistPage() {
  const { situationId } = useParams();
  const situation = getSituationById(situationId);

  if (!situation) {
    return <Navigate to="/" replace />;
  }

  return <ChecklistContent key={situation.id} situation={situation} />;
}

function ChecklistContent({ situation }: { situation: Situation }) {
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
