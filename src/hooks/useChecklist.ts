import { useEffect, useMemo, useState } from "react";
import { getSavedChecklist, saveChecklist } from "../services/checklistStorage";
import type { ChecklistItem } from "../types/checklist";

export const useChecklist = (situationId: string) => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    if (!situationId) {
      return [];
    }

    return getSavedChecklist(situationId).items;
  });

  useEffect(() => {
    if (!situationId) {
      return;
    }

    saveChecklist({ situationId, items });
  }, [items, situationId]);

  const addItem = (rawName: string) => {
    const name = rawName.trim();

    if (!name) {
      return false;
    }

    const normalizedName = name.toLowerCase();
    const isDuplicate = items.some(
      (item) => item.name.trim().toLowerCase() === normalizedName,
    );

    if (isDuplicate) {
      return false;
    }

    const newItem: ChecklistItem = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name,
      completed: false,
    };

    setItems((currentItems) => [...currentItems, newItem]);
    return true;
  };

  const deleteItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const resetChecklist = () => {
    setItems((currentItems) =>
      currentItems.map((item) => ({ ...item, completed: false })),
    );
  };

  const completedCount = useMemo(
    () => items.filter((item) => item.completed).length,
    [items],
  );

  const totalCount = items.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
    items,
    addItem,
    deleteItem,
    toggleItem,
    resetChecklist,
    completedCount,
    totalCount,
    progress,
  };
};
