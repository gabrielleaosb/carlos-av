import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { Workout, Exercise, ProgressPhoto, BodyMeasurement } from "../types";
import {
  MOCK_WORKOUTS,
  MOCK_PROGRESS_PHOTOS,
  MOCK_MEASUREMENTS,
} from "../constants/mockData";

interface WorkoutContextData {
  workouts: Workout[];
  progressPhotos: ProgressPhoto[];
  measurements: BodyMeasurement[];
  addWorkout: (workout: Omit<Workout, "id">) => void;
  updateWorkout: (id: string, data: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  initializeWorkouts: (templates: Omit<Workout, "id">[]) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  addProgressPhoto: (photo: Omit<ProgressPhoto, "id">) => void;
  deleteProgressPhoto: (id: string) => void;
  addMeasurement: (measurement: Omit<BodyMeasurement, "id">) => void;
  totalWorkoutsThisWeek: number;
  totalVolumeThisWeek: number;
  totalWorkouts: number;
}

const WorkoutContext = createContext<WorkoutContextData>(
  {} as WorkoutContextData
);

function calcTotalVolume(exercises: Exercise[]): number {
  return exercises.reduce((total, ex) => {
    return (
      total +
      ex.sets.reduce((sum, set) => {
        return sum + set.reps * (set.weight || 1);
      }, 0)
    );
  }, 0);
}

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS);
  const [progressPhotos, setProgressPhotos] =
    useState<ProgressPhoto[]>(MOCK_PROGRESS_PHOTOS);
  const [measurements, setMeasurements] =
    useState<BodyMeasurement[]>(MOCK_MEASUREMENTS);

  const addWorkout = useCallback((workout: Omit<Workout, "id">) => {
    const newWorkout: Workout = {
      ...workout,
      id: `w_${Date.now()}`,
      totalVolume: calcTotalVolume(workout.exercises),
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
  }, []);

  const updateWorkout = useCallback(
    (id: string, data: Partial<Workout>) => {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...data } : w))
      );
    },
    []
  );

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const initializeWorkouts = useCallback(
    (templates: Omit<Workout, "id">[]) => {
      const newWorkouts: Workout[] = templates.map((t) => ({
        ...t,
        id: `w_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        totalVolume: 0,
      }));
      setWorkouts(newWorkouts);
    },
    []
  );

  const getWorkoutById = useCallback(
    (id: string) => workouts.find((w) => w.id === id),
    [workouts]
  );

  const addProgressPhoto = useCallback(
    (photo: Omit<ProgressPhoto, "id">) => {
      setProgressPhotos((prev) => [
        { ...photo, id: `p_${Date.now()}` },
        ...prev,
      ]);
    },
    []
  );

  const deleteProgressPhoto = useCallback((id: string) => {
    setProgressPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addMeasurement = useCallback(
    (measurement: Omit<BodyMeasurement, "id">) => {
      setMeasurements((prev) => [
        { ...measurement, id: `m_${Date.now()}` },
        ...prev,
      ]);
    },
    []
  );

  const thisWeekWorkouts = workouts.filter((w) => isThisWeek(w.date));
  const totalWorkoutsThisWeek = thisWeekWorkouts.length;
  const totalVolumeThisWeek = thisWeekWorkouts.reduce(
    (sum, w) => sum + (w.totalVolume ?? 0),
    0
  );

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        progressPhotos,
        measurements,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkoutById,
        addProgressPhoto,
        deleteProgressPhoto,
        addMeasurement,
        initializeWorkouts,
        totalWorkoutsThisWeek,
        totalVolumeThisWeek,
        totalWorkouts: workouts.length,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context)
    throw new Error("useWorkouts deve ser usado dentro de WorkoutProvider");
  return context;
}
