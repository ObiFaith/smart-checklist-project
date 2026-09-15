import { defaultChecklists } from "../data/defaultChecklists";
import type { Checklist, ChecklistItem } from "../types/checklist";

const STORAGE_PREFIX = "did-i-forget-something:";

const createItemId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeItem = (
  item: Partial<ChecklistItem> | null | undefined,
): ChecklistItem | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const name = typeof item.name === "string" ? item.name.trim() : "";
  const id =
    typeof item.id === "string" && item.id.trim()
      ? item.id.trim()
      : createItemId();

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    completed: Boolean(item.completed),
  };
};

const buildDefaultChecklist = (situationId: string): Checklist => {
  const defaultItems = defaultChecklists[situationId] ?? [];

  return {
    situationId,
    items: defaultItems.map((name) => ({
      id: createItemId(),
      name,
      completed: false,
    })),
  };
};

export const getChecklistStorageKey = (situationId: string) =>
  `${STORAGE_PREFIX}${situationId}`;

export const safeParseChecklist = (raw: string | null): Checklist | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Checklist>;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.situationId !== "string"
    ) {
      return null;
    }

    if (!Array.isArray(parsed.items)) {
      return null;
    }

    const items = parsed.items
      .map((item) => normalizeItem(item as Partial<ChecklistItem>))
      .filter((item): item is ChecklistItem => item !== null);

    return {
      situationId: parsed.situationId,
      items,
    };
  } catch {
    return null;
  }
};

export const saveChecklist = (checklist: Checklist) => {
  try {
    localStorage.setItem(
      getChecklistStorageKey(checklist.situationId),
      JSON.stringify(checklist),
    );
  } catch {
    // Ignore write failures in restricted browser contexts.
  }
};

export const getSavedChecklist = (situationId: string): Checklist => {
  const raw = localStorage.getItem(getChecklistStorageKey(situationId));
  const parsed = safeParseChecklist(raw);

  if (parsed) {
    return parsed;
  }

  const initialized = buildDefaultChecklist(situationId);
  saveChecklist(initialized);
  return initialized;
};

export const initializeChecklist = (situationId: string): Checklist =>
  getSavedChecklist(situationId);
