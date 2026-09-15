import type { Situation } from "../types/checklist";

export const situations: Situation[] = [
  {
    id: "work",
    name: "Going to Work",
    icon: "💼",
    description: "Make sure you have everything before you head out the door.",
  },
  {
    id: "travel",
    name: "Traveling",
    icon: "✈️",
    description: "Double-check the essentials before you leave for your trip.",
  },
  {
    id: "school",
    name: "Going to School",
    icon: "🎓",
    description: "Be ready for class and keep your essentials in one place.",
  },
  {
    id: "gym",
    name: "Going to the Gym",
    icon: "🏋️",
    description: "Pack the gear you need to get through your workout.",
  },
];

export const getSituationById = (situationId: string | undefined) =>
  situations.find((situation) => situation.id === situationId);
