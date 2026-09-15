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
  localStorage.setItem(
    getChecklistStorageKey(checklist.situationId),
    JSON.stringify(checklist),
  );
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

const readCustomScenarios = (): {
  scenarios: Situation[];
  succeeded: boolean;
} => {
  try {
    const raw = localStorage.getItem(CUSTOM_SCENARIOS_KEY);

    if (!raw) {
      return { scenarios: [], succeeded: true };
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return { scenarios: [], succeeded: true };
    }

    return {
      scenarios: parsed
        .map((scenario) =>
          validateCustomScenario(scenario as Partial<Situation>),
        )
        .filter((scenario): scenario is Situation => scenario !== null),
      succeeded: true,
    };
  } catch {
    return { scenarios: [], succeeded: false };
  }
};

export const listCustomScenarios = (): Situation[] =>
  readCustomScenarios().scenarios;

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

  const metadata = readCustomScenarios();

  if (!metadata.succeeded) {
    throw new Error("Could not read existing checklists.");
  }

  const existingScenarios = metadata.scenarios;
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

  const normalizedItems = (items ?? [])
    .map((item) =>
      typeof item === "string"
        ? { id: createItemId(), name: item.trim(), completed: false }
        : normalizeItem(item),
    )
    .filter(
      (item): item is ChecklistItem => item !== null && item.name.length > 0,
    );

  const nextScenarios = [...existingScenarios, scenario];
  localStorage.setItem(CUSTOM_SCENARIOS_KEY, JSON.stringify(nextScenarios));

  try {
    saveChecklist({ situationId: scenario.id, items: normalizedItems });
  } catch (error) {
    try {
      localStorage.setItem(
        CUSTOM_SCENARIOS_KEY,
        JSON.stringify(existingScenarios),
      );
    } catch {
      // Preserve the original checklist write failure.
    }

    throw error;
  }

  return scenario;
};

export const deleteCustomScenario = (situationId: string): boolean => {
  const metadata = readCustomScenarios();

  if (!metadata.succeeded) {
    return false;
  }

  const nextScenarios = metadata.scenarios.filter(
    (scenario) => scenario.id !== situationId,
  );

  try {
    localStorage.setItem(CUSTOM_SCENARIOS_KEY, JSON.stringify(nextScenarios));
    localStorage.removeItem(getChecklistStorageKey(situationId));
    return true;
  } catch {
    try {
      localStorage.setItem(
        CUSTOM_SCENARIOS_KEY,
        JSON.stringify(metadata.scenarios),
      );
    } catch {
      // Restoration is best effort after a failed deletion.
    }

    return false;
  }
};

export const renameCustomScenario = (situationId: string, name: string) => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Checklist name is required.");
  }

  const metadata = readCustomScenarios();

  if (!metadata.succeeded) {
    throw new Error("Could not read existing checklists.");
  }

  const currentScenarios = metadata.scenarios;
  const scenarioExists = currentScenarios.some(
    (scenario) => scenario.id === situationId,
  );

  if (!scenarioExists) {
    throw new Error("Checklist not found.");
  }

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
