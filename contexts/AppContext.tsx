import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout, WorkoutLog, RoutineDay, WeightEntry } from "../types";
import { TEMPLATE_WORKOUTS } from "../constants/workoutTemplates";

const KEYS = {
  custom:  "@app:customWorkouts",
  logs:    "@app:logs",
  routine: "@app:routine",
  weight:  "@app:weightHistory",
};

interface AppContextData {
  customWorkouts: Workout[];
  logs:           WorkoutLog[];
  routine:        RoutineDay[];
  weightHistory:  WeightEntry[];

  addCustomWorkout:    (w: Omit<Workout, "id" | "isCustom">) => void;
  updateCustomWorkout: (id: string, w: Omit<Workout, "id" | "isCustom">) => void;
  deleteCustomWorkout: (id: string) => void;

  setRoutineDay:    (day: RoutineDay) => void;
  removeRoutineDay: (dayOfWeek: number) => void;

  logWorkout:     (log: Omit<WorkoutLog, "id">) => void;
  addWeightEntry: (entry: WeightEntry) => void;

  getWorkoutById:     (id: string) => Workout | undefined;
  getExerciseHistory: (name: string) => { date: string; maxWeight: number }[];
  getTodayRoutine:    () => RoutineDay | undefined;
  getThisWeekLogs:    () => WorkoutLog[];
  getDoneThisWeek:    () => number[];
}

const AppContext = createContext<AppContextData>({} as AppContextData);

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>([]);
  const [logs,           setLogs]           = useState<WorkoutLog[]>([]);
  const [routine,        setRoutineState]   = useState<RoutineDay[]>([]);
  const [weightHistory,  setWeightHistory]  = useState<WeightEntry[]>([]);
  const [ready,          setReady]          = useState(false);

  // Refs para evitar chamadas duplicadas do AsyncStorage dentro de setState (React StrictMode)
  const cwRef  = useRef<Workout[]>([]);
  const lgRef  = useRef<WorkoutLog[]>([]);
  const rtRef  = useRef<RoutineDay[]>([]);
  const whRef  = useRef<WeightEntry[]>([]);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEYS.custom),
      AsyncStorage.getItem(KEYS.logs),
      AsyncStorage.getItem(KEYS.routine),
      AsyncStorage.getItem(KEYS.weight),
    ]).then(([cw, lg, rt, wh]) => {
      const cwd = cw ? JSON.parse(cw) as Workout[]    : [];
      const lgd = lg ? JSON.parse(lg) as WorkoutLog[] : [];
      const rtd = rt ? JSON.parse(rt) as RoutineDay[] : [];
      const whd = wh ? JSON.parse(wh) as WeightEntry[]: [];
      cwRef.current = cwd;
      lgRef.current = lgd;
      rtRef.current = rtd;
      whRef.current = whd;
      setCustomWorkouts(cwd);
      setLogs(lgd);
      setRoutineState(rtd);
      setWeightHistory(whd);
      setReady(true);
    });
  }, []);

  // Helpers que escrevem no AsyncStorage e atualizam ref + state de forma segura
  const commitCustomWorkouts = useCallback((next: Workout[]) => {
    cwRef.current = next;
    setCustomWorkouts(next);
    AsyncStorage.setItem(KEYS.custom, JSON.stringify(next));
  }, []);

  const commitLogs = useCallback((next: WorkoutLog[]) => {
    lgRef.current = next;
    setLogs(next);
    AsyncStorage.setItem(KEYS.logs, JSON.stringify(next));
  }, []);

  const commitRoutine = useCallback((next: RoutineDay[]) => {
    rtRef.current = next;
    setRoutineState(next);
    AsyncStorage.setItem(KEYS.routine, JSON.stringify(next));
  }, []);

  const commitWeight = useCallback((next: WeightEntry[]) => {
    whRef.current = next;
    setWeightHistory(next);
    AsyncStorage.setItem(KEYS.weight, JSON.stringify(next));
  }, []);

  // ─── Public API ────────────────────────────────────────────────────

  const addCustomWorkout = useCallback((w: Omit<Workout, "id" | "isCustom">) => {
    commitCustomWorkouts([...cwRef.current, { ...w, id: uid(), isCustom: true }]);
  }, [commitCustomWorkouts]);

  const updateCustomWorkout = useCallback((id: string, w: Omit<Workout, "id" | "isCustom">) => {
    commitCustomWorkouts(cwRef.current.map((cw) => cw.id === id ? { ...w, id, isCustom: true } : cw));
  }, [commitCustomWorkouts]);

  const deleteCustomWorkout = useCallback((id: string) => {
    commitCustomWorkouts(cwRef.current.filter((w) => w.id !== id));
  }, [commitCustomWorkouts]);

  const setRoutineDay = useCallback((day: RoutineDay) => {
    commitRoutine([...rtRef.current.filter((d) => d.dayOfWeek !== day.dayOfWeek), day]);
  }, [commitRoutine]);

  const removeRoutineDay = useCallback((dayOfWeek: number) => {
    commitRoutine(rtRef.current.filter((d) => d.dayOfWeek !== dayOfWeek));
  }, [commitRoutine]);

  const logWorkout = useCallback((log: Omit<WorkoutLog, "id">) => {
    commitLogs([{ ...log, id: uid() }, ...lgRef.current]);
  }, [commitLogs]);

  const addWeightEntry = useCallback((entry: WeightEntry) => {
    const next = [entry, ...whRef.current.filter((e) => e.date !== entry.date)]
      .sort((a, b) => b.date.localeCompare(a.date));
    commitWeight(next);
  }, [commitWeight]);

  const getWorkoutById = useCallback((id: string) =>
    TEMPLATE_WORKOUTS.find((w) => w.id === id) ?? cwRef.current.find((w) => w.id === id),
  []);

  const getExerciseHistory = useCallback((name: string) =>
    lgRef.current
      .filter((log) => log.exercises.some((e) => e.name === name))
      .map((log) => ({
        date:      log.date,
        maxWeight: log.exercises.find((e) => e.name === name)!.maxWeight,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  []);

  const getTodayRoutine = useCallback(() => {
    const today = new Date().getDay();
    return rtRef.current.find((d) => d.dayOfWeek === today);
  }, []);

  const getThisWeekLogs = useCallback(() => {
    const now   = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return lgRef.current.filter((l) => new Date(l.date) >= start);
  }, []);

  const getDoneThisWeek = useCallback(() =>
    getThisWeekLogs().map((l) => new Date(l.date).getDay()),
  [getThisWeekLogs]);

  if (!ready) return null;

  return (
    <AppContext.Provider value={{
      customWorkouts, logs, routine, weightHistory,
      addCustomWorkout, updateCustomWorkout, deleteCustomWorkout,
      setRoutineDay, removeRoutineDay,
      logWorkout, addWeightEntry,
      getWorkoutById, getExerciseHistory,
      getTodayRoutine, getThisWeekLogs, getDoneThisWeek,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
