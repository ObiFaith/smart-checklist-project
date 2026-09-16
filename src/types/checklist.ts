export interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface Situation {
  id: string;
  name: string;
  icon: string;
  description: string;
  isTemplate: boolean;
}

export interface Checklist {
  situationId: string;
  items: ChecklistItem[];
}

export type ChecklistProps = {
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
  progress: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddItem: (name: string) => boolean;
  onReset: () => void;
};
