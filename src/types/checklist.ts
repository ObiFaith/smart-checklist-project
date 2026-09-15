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
}

export interface Checklist {
  situationId: string;
  items: ChecklistItem[];
}
