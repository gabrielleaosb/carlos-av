import { Workout, WorkoutExercise, MuscleGroup } from "../types";

function ex(id: string, name: string, muscleGroup: MuscleGroup, sets = 3, reps = 12): WorkoutExercise {
  return { id, name, muscleGroup, sets, reps };
}

export const TEMPLATE_WORKOUTS: Workout[] = [
  // ── FULLBODY ────────────────────────────────────────────────────────
  {
    id: "tpl_fullbody",
    name: "Fullbody",
    splitLabel: "Fullbody",
    isCustom: false,
    exercises: [
      ex("fb1", "Agachamento",    "Pernas",  4, 10),
      ex("fb2", "Supino Reto",    "Peito",   3, 10),
      ex("fb3", "Remada Curvada", "Costas",  3, 10),
      ex("fb4", "Desenvolvimento","Ombros",  3, 12),
      ex("fb5", "Rosca Direta",   "Bíceps",  3, 12),
      ex("fb6", "Tríceps Corda",  "Tríceps", 3, 12),
    ],
  },

  // ── AB ──────────────────────────────────────────────────────────────
  {
    id: "tpl_ab_a",
    name: "Treino A — Superior",
    splitLabel: "AB",
    isCustom: false,
    exercises: [
      ex("ab_a1", "Supino Reto",      "Peito",   4, 10),
      ex("ab_a2", "Supino Inclinado", "Peito",   3, 12),
      ex("ab_a3", "Puxada Frontal",   "Costas",  4, 10),
      ex("ab_a4", "Remada Curvada",   "Costas",  3, 12),
      ex("ab_a5", "Desenvolvimento",  "Ombros",  3, 12),
      ex("ab_a6", "Rosca Direta",     "Bíceps",  3, 12),
      ex("ab_a7", "Tríceps Testa",    "Tríceps", 3, 12),
    ],
  },
  {
    id: "tpl_ab_b",
    name: "Treino B — Inferior",
    splitLabel: "AB",
    isCustom: false,
    exercises: [
      ex("ab_b1", "Agachamento",        "Pernas",  4, 10),
      ex("ab_b2", "Leg Press",          "Pernas",  3, 12),
      ex("ab_b3", "Extensão de Pernas", "Pernas",  3, 15),
      ex("ab_b4", "Flexão de Pernas",   "Pernas",  3, 15),
      ex("ab_b5", "Hip Thrust",         "Glúteos", 4, 12),
      ex("ab_b6", "Abdominal Crunch",   "Abdômen", 3, 20),
    ],
  },

  // ── ABC ─────────────────────────────────────────────────────────────
  {
    id: "tpl_abc_a",
    name: "Treino A — Peito e Tríceps",
    splitLabel: "ABC",
    isCustom: false,
    exercises: [
      ex("abc_a1", "Supino Reto",      "Peito",   4, 10),
      ex("abc_a2", "Supino Inclinado", "Peito",   3, 12),
      ex("abc_a3", "Crucifixo",        "Peito",   3, 15),
      ex("abc_a4", "Peck Deck",        "Peito",   3, 15),
      ex("abc_a5", "Tríceps Corda",    "Tríceps", 4, 12),
      ex("abc_a6", "Tríceps Testa",    "Tríceps", 3, 12),
    ],
  },
  {
    id: "tpl_abc_b",
    name: "Treino B — Costas e Bíceps",
    splitLabel: "ABC",
    isCustom: false,
    exercises: [
      ex("abc_b1", "Puxada Frontal",    "Costas", 4, 10),
      ex("abc_b2", "Remada Curvada",    "Costas", 4, 10),
      ex("abc_b3", "Remada Unilateral", "Costas", 3, 12),
      ex("abc_b4", "Barra Fixa",        "Costas", 3,  8),
      ex("abc_b5", "Rosca Direta",      "Bíceps", 4, 12),
      ex("abc_b6", "Rosca Martelo",     "Bíceps", 3, 12),
    ],
  },
  {
    id: "tpl_abc_c",
    name: "Treino C — Pernas",
    splitLabel: "ABC",
    isCustom: false,
    exercises: [
      ex("abc_c1", "Agachamento",        "Pernas",  4, 10),
      ex("abc_c2", "Leg Press",          "Pernas",  4, 12),
      ex("abc_c3", "Extensão de Pernas", "Pernas",  3, 15),
      ex("abc_c4", "Flexão de Pernas",   "Pernas",  3, 15),
      ex("abc_c5", "Hip Thrust",         "Glúteos", 4, 12),
    ],
  },

  // ── ABCD ────────────────────────────────────────────────────────────
  {
    id: "tpl_abcd_a",
    name: "Treino A — Peito",
    splitLabel: "ABCD",
    isCustom: false,
    exercises: [
      ex("abcd_a1", "Supino Reto",      "Peito", 4, 10),
      ex("abcd_a2", "Supino Inclinado", "Peito", 4, 10),
      ex("abcd_a3", "Crucifixo",        "Peito", 3, 15),
      ex("abcd_a4", "Peck Deck",        "Peito", 3, 15),
    ],
  },
  {
    id: "tpl_abcd_b",
    name: "Treino B — Costas",
    splitLabel: "ABCD",
    isCustom: false,
    exercises: [
      ex("abcd_b1", "Puxada Frontal",    "Costas", 4, 10),
      ex("abcd_b2", "Remada Curvada",    "Costas", 4, 10),
      ex("abcd_b3", "Remada Unilateral", "Costas", 3, 12),
      ex("abcd_b4", "Barra Fixa",        "Costas", 4,  8),
      ex("abcd_b5", "Levantamento Terra","Costas", 3,  8),
    ],
  },
  {
    id: "tpl_abcd_c",
    name: "Treino C — Pernas",
    splitLabel: "ABCD",
    isCustom: false,
    exercises: [
      ex("abcd_c1", "Agachamento",        "Pernas",  4, 10),
      ex("abcd_c2", "Leg Press",          "Pernas",  4, 12),
      ex("abcd_c3", "Extensão de Pernas", "Pernas",  3, 15),
      ex("abcd_c4", "Flexão de Pernas",   "Pernas",  3, 15),
      ex("abcd_c5", "Hip Thrust",         "Glúteos", 4, 12),
    ],
  },
  {
    id: "tpl_abcd_d",
    name: "Treino D — Ombros e Braços",
    splitLabel: "ABCD",
    isCustom: false,
    exercises: [
      ex("abcd_d1", "Desenvolvimento",  "Ombros",  4, 10),
      ex("abcd_d2", "Elevação Lateral", "Ombros",  4, 15),
      ex("abcd_d3", "Rosca Direta",     "Bíceps",  3, 12),
      ex("abcd_d4", "Rosca Martelo",    "Bíceps",  3, 12),
      ex("abcd_d5", "Tríceps Corda",    "Tríceps", 3, 12),
      ex("abcd_d6", "Tríceps Francês",  "Tríceps", 3, 12),
    ],
  },

  // ── ABCDE ───────────────────────────────────────────────────────────
  {
    id: "tpl_abcde_a",
    name: "Treino A — Peito",
    splitLabel: "ABCDE",
    isCustom: false,
    exercises: [
      ex("abcde_a1", "Supino Reto",      "Peito", 5,  8),
      ex("abcde_a2", "Supino Inclinado", "Peito", 4, 10),
      ex("abcde_a3", "Supino Declinado", "Peito", 4, 10),
      ex("abcde_a4", "Crucifixo",        "Peito", 3, 15),
      ex("abcde_a5", "Peck Deck",        "Peito", 3, 15),
    ],
  },
  {
    id: "tpl_abcde_b",
    name: "Treino B — Costas",
    splitLabel: "ABCDE",
    isCustom: false,
    exercises: [
      ex("abcde_b1", "Puxada Frontal",    "Costas", 5,  8),
      ex("abcde_b2", "Remada Curvada",    "Costas", 4, 10),
      ex("abcde_b3", "Remada Unilateral", "Costas", 4, 10),
      ex("abcde_b4", "Barra Fixa",        "Costas", 4,  8),
      ex("abcde_b5", "Levantamento Terra","Costas", 3,  6),
    ],
  },
  {
    id: "tpl_abcde_c",
    name: "Treino C — Pernas",
    splitLabel: "ABCDE",
    isCustom: false,
    exercises: [
      ex("abcde_c1", "Agachamento",        "Pernas",  5,  8),
      ex("abcde_c2", "Leg Press",          "Pernas",  4, 10),
      ex("abcde_c3", "Extensão de Pernas", "Pernas",  4, 15),
      ex("abcde_c4", "Flexão de Pernas",   "Pernas",  4, 15),
      ex("abcde_c5", "Hip Thrust",         "Glúteos", 4, 12),
    ],
  },
  {
    id: "tpl_abcde_d",
    name: "Treino D — Ombros",
    splitLabel: "ABCDE",
    isCustom: false,
    exercises: [
      ex("abcde_d1", "Desenvolvimento",  "Ombros", 5,  8),
      ex("abcde_d2", "Elevação Lateral", "Ombros", 4, 15),
      ex("abcde_d3", "Elevação Frontal", "Ombros", 4, 15),
      ex("abcde_d4", "Remada Alta",      "Ombros", 3, 12),
    ],
  },
  {
    id: "tpl_abcde_e",
    name: "Treino E — Braços",
    splitLabel: "ABCDE",
    isCustom: false,
    exercises: [
      ex("abcde_e1", "Rosca Direta",    "Bíceps",  4, 12),
      ex("abcde_e2", "Rosca Alternada", "Bíceps",  4, 12),
      ex("abcde_e3", "Rosca Martelo",   "Bíceps",  3, 12),
      ex("abcde_e4", "Tríceps Corda",   "Tríceps", 4, 12),
      ex("abcde_e5", "Tríceps Testa",   "Tríceps", 4, 12),
      ex("abcde_e6", "Tríceps Francês", "Tríceps", 3, 12),
    ],
  },
];

export type SplitType = "Fullbody" | "AB" | "ABC" | "ABCD" | "ABCDE";

export const SPLITS: { type: SplitType; label: string; description: string }[] = [
  { type: "Fullbody", label: "Fullbody",   description: "1 treino · Corpo inteiro" },
  { type: "AB",       label: "A/B",        description: "2 treinos · Superior + Inferior" },
  { type: "ABC",      label: "A/B/C",      description: "3 treinos · Empurra · Puxa · Pernas" },
  { type: "ABCD",     label: "A/B/C/D",    description: "4 treinos · Por grupo muscular" },
  { type: "ABCDE",    label: "A/B/C/D/E",  description: "5 treinos · Avançado" },
];

export function getWorkoutsBySplit(split: SplitType) {
  return TEMPLATE_WORKOUTS.filter((w) => w.splitLabel === split);
}
