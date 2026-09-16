import { getSituationById } from "../data/situations";
import { Navigate, useParams } from "react-router-dom";
import { ChecklistContent } from "../components/checklist/ChecklistContent";

export function ChecklistPage() {
  const { situationId } = useParams();
  const situation = getSituationById(situationId);

  if (!situation) {
    return <Navigate to="/" replace />;
  }

  return <ChecklistContent key={situation.id} situation={situation} />;
}
