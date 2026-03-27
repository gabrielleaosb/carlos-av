export type UserGoal = "muscle_gain" | "fat_loss" | "bf_reduction" | "general";

export interface User {
  id: string;
  name: string;
  email: string;
  weight?: number;   // kg
  height?: number;   // cm
  goal?: UserGoal;
  onboardingDone: boolean;
  createdAt: string;
}

export type MuscleGroup =
  | "Peito"
  | "Costas"
  | "Ombros"
  | "Bíceps"
  | "Tríceps"
  | "Pernas"
  | "Glúteos"
  | "Abdômen"
  | "Full Body";

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  isCustom: boolean;
  splitLabel?: string; // 'Fullbody' | 'AB' | 'ABC' | 'ABCD' | 'ABCDE'
}

export interface LoggedExercise {
  name: string;
  muscleGroup: MuscleGroup;
  maxWeight: number; // kg — maior carga usada na sessão
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;      // ISO string
  duration: number;  // minutos
  exercises: LoggedExercise[];
}

export interface RoutineDay {
  dayOfWeek: number;    // 0=Dom, 1=Seg ... 6=Sáb
  workoutId: string;
  workoutName: string;
}

export interface WeightEntry {
  date: string;  // YYYY-MM-DD
  weight: number;
}
