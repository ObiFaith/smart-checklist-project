import type { Situation } from "../../types/checklist";

type SituationCardProps = {
  situation: Situation;
  onSelect: (id: string) => void;
};

export function SituationCard({ situation, onSelect }: SituationCardProps) {
  return (
    <button
      type="button"
      className="situation-card"
      onClick={() => onSelect(situation.id)}
    >
      <span className="situation-icon" aria-hidden="true">
        {situation.icon}
      </span>
      <span className="situation-name">{situation.name}</span>
    </button>
  );
}
