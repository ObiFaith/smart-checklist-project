import { listCustomScenarios } from "../services/checklistStorage";
import type { Situation } from "../types/checklist";

export const situations: Situation[] = [
  {
    id: "work",
    name: "Going to Work",
    icon: "💼",
    description: "Make sure you have everything before you head out the door.",
    isTemplate: true,
  },
  {
    id: "travel",
    name: "Traveling",
    icon: "✈️",
    description: "Double-check the essentials before you leave for your trip.",
    isTemplate: true,
  },
  {
    id: "school",
    name: "Going to School",
    icon: "🎓",
    description: "Be ready for class and keep your essentials in one place.",
    isTemplate: true,
  },
  {
    id: "gym",
    name: "Going to the Gym",
    icon: "🏋️",
    description: "Pack the gear you need to get through your workout.",
    isTemplate: true,
  },
];

export const getSituationById = (situationId: string | undefined) =>
  situations.find((situation) => situation.id === situationId) ??
  listCustomScenarios().find((situation) => situation.id === situationId);
