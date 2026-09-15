import { defaultChecklists } from "../data/defaultChecklists";
import type { Checklist, ChecklistItem, Situation } from "../types/checklist";

const STORAGE_PREFIX = "did-i-forget-something:";
const CUSTOM_SCENARIOS_KEY = `${STORAGE_PREFIX}custom-scenarios`;
const CUSTOM_PREFIX = `${STORAGE_PREFIX}custom:`;

const createItemId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createScenarioId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `custom-${crypto.randomUUID()}`;
  }

  return `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  situationId.startsWith("custom-")
    ? `${CUSTOM_PREFIX}${situationId}`
    : `${STORAGE_PREFIX}${situationId}`;

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

  if (situationId.startsWith("custom-")) {
    const initialized: Checklist = { situationId, items: [] };
    saveChecklist(initialized);
    return initialized;
  }

  const initialized = buildDefaultChecklist(situationId);
  saveChecklist(initialized);
  return initialized;
};

export const initializeChecklist = (situationId: string): Checklist =>
  getSavedChecklist(situationId);

const validateCustomScenario = (
  value: Partial<Situation> | null | undefined,
): Situation | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const id =
    typeof value.id === "string" && value.id.trim()
      ? value.id.trim()
      : createScenarioId();
  const icon =
    typeof value.icon === "string" && value.icon.trim()
      ? value.icon.trim()
      : "✨";
  const description =
    typeof value.description === "string" && value.description.trim()
      ? value.description.trim()
      : "Custom checklist";

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    icon,
    description,
    isTemplate: false,
  };
};

export const listCustomScenarios = (): Situation[] => {
  const raw = localStorage.getItem(CUSTOM_SCENARIOS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((scenario) => validateCustomScenario(scenario as Partial<Situation>))
      .filter((scenario): scenario is Situation => scenario !== null);
  } catch {
    return [];
  }
};

export const getCustomScenarioById = (situationId: string | undefined) =>
  listCustomScenarios().find((scenario) => scenario.id === situationId);

export const createCustomScenario = ({
  name,
  icon,
  items,
}: {
  name: string;
  icon?: string;
  items?: Array<ChecklistItem | string>;
}): Situation => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Checklist name is required.");
  }

  const existingScenarios = listCustomScenarios();
  const hasDuplicateName = existingScenarios.some(
    (scenario) =>
      scenario.name.trim().toLowerCase() === trimmedName.toLowerCase(),
  );

  if (hasDuplicateName) {
    throw new Error("You already have a checklist with that name.");
  }

  const scenario: Situation = {
    id: createScenarioId(),
    name: trimmedName,
    icon: (icon ?? "✨").trim() || "✨",
    description: "Custom checklist",
    isTemplate: false,
  };

  const nextScenarios = [...existingScenarios, scenario];
  localStorage.setItem(CUSTOM_SCENARIOS_KEY, JSON.stringify(nextScenarios));

  const normalizedItems = (items ?? [])
    .map((item) =>
      typeof item === "string"
        ? { id: createItemId(), name: item.trim(), completed: false }
        : normalizeItem(item),
    )
    .filter(
      (item): item is ChecklistItem => item !== null && item.name.length > 0,
    );

  saveChecklist({ situationId: scenario.id, items: normalizedItems });

  return scenario;
};

export const deleteCustomScenario = (situationId: string) => {
  const nextScenarios = listCustomScenarios().filter(
    (scenario) => scenario.id !== situationId,
  );

  localStorage.setItem(CUSTOM_SCENARIOS_KEY, JSON.stringify(nextScenarios));
  localStorage.removeItem(getChecklistStorageKey(situationId));
};

export const renameCustomScenario = (situationId: string, name: string) => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Checklist name is required.");
  }

  const currentScenarios = listCustomScenarios();
  const hasDuplicateName = currentScenarios.some(
    (scenario) =>
      scenario.id !== situationId &&
      scenario.name.trim().toLowerCase() === trimmedName.toLowerCase(),
  );

  if (hasDuplicateName) {
    throw new Error("You already have a checklist with that name.");
  }

  const nextScenarios = currentScenarios.map((scenario) =>
    scenario.id === situationId ? { ...scenario, name: trimmedName } : scenario,
  );

  localStorage.setItem(CUSTOM_SCENARIOS_KEY, JSON.stringify(nextScenarios));
};
