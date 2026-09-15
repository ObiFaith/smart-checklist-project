import { situations } from "../../data/situations";
import { SituationCard } from "./SituationCard";

type SituationListProps = {
  onSelect: (id: string) => void;
};

export function SituationList({ onSelect }: SituationListProps) {
  return (
    <div className="situation-grid">
      {situations.map((situation) => (
        <SituationCard
          key={situation.id}
          situation={situation}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
