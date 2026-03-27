import { MuscleGroup } from "../types";

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  // Peito
  { id: "e1", name: "Supino Reto", muscleGroup: "Peito" },
  { id: "e2", name: "Supino Inclinado", muscleGroup: "Peito" },
  { id: "e3", name: "Crucifixo", muscleGroup: "Peito" },
  { id: "e4", name: "Peck Deck", muscleGroup: "Peito" },
  { id: "e5", name: "Flexão de Braço", muscleGroup: "Peito" },
  // Costas
  { id: "e6", name: "Barra Fixa", muscleGroup: "Costas" },
  { id: "e7", name: "Remada Curvada", muscleGroup: "Costas" },
  { id: "e8", name: "Puxada Frontal", muscleGroup: "Costas" },
  { id: "e9", name: "Remada Unilateral", muscleGroup: "Costas" },
  { id: "e10", name: "Levantamento Terra", muscleGroup: "Costas" },
  // Ombros
  { id: "e11", name: "Desenvolvimento", muscleGroup: "Ombros" },
  { id: "e12", name: "Elevação Lateral", muscleGroup: "Ombros" },
  { id: "e13", name: "Elevação Frontal", muscleGroup: "Ombros" },
  { id: "e14", name: "Remada Alta", muscleGroup: "Ombros" },
  // Bíceps
  { id: "e15", name: "Rosca Direta", muscleGroup: "Bíceps" },
  { id: "e16", name: "Rosca Alternada", muscleGroup: "Bíceps" },
  { id: "e17", name: "Rosca Concentrada", muscleGroup: "Bíceps" },
  { id: "e18", name: "Rosca Martelo", muscleGroup: "Bíceps" },
  // Tríceps
  { id: "e19", name: "Tríceps Testa", muscleGroup: "Tríceps" },
  { id: "e20", name: "Tríceps Corda", muscleGroup: "Tríceps" },
  { id: "e21", name: "Tríceps Francês", muscleGroup: "Tríceps" },
  { id: "e22", name: "Mergulho", muscleGroup: "Tríceps" },
  // Pernas
  { id: "e23", name: "Agachamento", muscleGroup: "Pernas" },
  { id: "e24", name: "Leg Press", muscleGroup: "Pernas" },
  { id: "e25", name: "Extensão de Pernas", muscleGroup: "Pernas" },
  { id: "e26", name: "Flexão de Pernas", muscleGroup: "Pernas" },
  { id: "e27", name: "Afundo", muscleGroup: "Pernas" },
  // Glúteos
  { id: "e28", name: "Hip Thrust", muscleGroup: "Glúteos" },
  { id: "e29", name: "Glúteo 4 Apoios", muscleGroup: "Glúteos" },
  { id: "e30", name: "Abdução de Quadril", muscleGroup: "Glúteos" },
  // Abdômen
  { id: "e31", name: "Abdominal Crunch", muscleGroup: "Abdômen" },
  { id: "e32", name: "Prancha", muscleGroup: "Abdômen" },
  { id: "e33", name: "Elevação de Pernas", muscleGroup: "Abdômen" },
  // Cardio
  { id: "e34", name: "Esteira", muscleGroup: "Cardio" },
  { id: "e35", name: "Bike", muscleGroup: "Cardio" },
  { id: "e36", name: "Pular Corda", muscleGroup: "Cardio" },
  { id: "e37", name: "Burpees", muscleGroup: "Full Body" },
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "Peito",
  "Costas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Pernas",
  "Glúteos",
  "Abdômen",
  "Cardio",
  "Full Body",
];

export const MUSCLE_GROUP_ICONS: Record<MuscleGroup, string> = {
  Peito: "💪",
  Costas: "🔙",
  Ombros: "🏋️",
  Bíceps: "💪",
  Tríceps: "💪",
  Pernas: "🦵",
  Glúteos: "🍑",
  Abdômen: "🎯",
  Cardio: "🏃",
  "Full Body": "⚡",
};
