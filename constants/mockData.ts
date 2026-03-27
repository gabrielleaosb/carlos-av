import { Workout, User, ProgressPhoto, BodyMeasurement } from "../types";

export const MOCK_USER: User = {
  id: "u1",
  name: "Carlos Silva",
  email: "carlos@email.com",
  weight: 82,
  height: 178,
  goal: "muscle_gain",
  createdAt: "2024-01-15T10:00:00Z",
};

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w1",
    name: "Peito e Tríceps",
    date: "2025-03-25T08:30:00Z",
    duration: 65,
    totalVolume: 8740,
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      gym: "Smart Fit - Centro",
      address: "Av. Paulista, 1000 - São Paulo",
    },
    exercises: [
      {
        id: "ex1",
        name: "Supino Reto",
        muscleGroup: "Peito",
        sets: [
          { id: "s1", reps: 12, weight: 60, completed: true },
          { id: "s2", reps: 10, weight: 65, completed: true },
          { id: "s3", reps: 8, weight: 70, completed: true },
          { id: "s4", reps: 8, weight: 70, completed: true },
        ],
      },
      {
        id: "ex2",
        name: "Supino Inclinado",
        muscleGroup: "Peito",
        sets: [
          { id: "s5", reps: 12, weight: 50, completed: true },
          { id: "s6", reps: 10, weight: 55, completed: true },
          { id: "s7", reps: 8, weight: 55, completed: true },
        ],
      },
      {
        id: "ex3",
        name: "Tríceps Corda",
        muscleGroup: "Tríceps",
        sets: [
          { id: "s8", reps: 15, weight: 25, completed: true },
          { id: "s9", reps: 12, weight: 27.5, completed: true },
          { id: "s10", reps: 12, weight: 27.5, completed: true },
        ],
      },
    ],
  },
  {
    id: "w2",
    name: "Costas e Bíceps",
    date: "2025-03-23T09:00:00Z",
    duration: 70,
    totalVolume: 10200,
    location: {
      latitude: -23.5489,
      longitude: -46.6388,
      gym: "Smart Fit - Centro",
      address: "Av. Paulista, 1000 - São Paulo",
    },
    exercises: [
      {
        id: "ex4",
        name: "Barra Fixa",
        muscleGroup: "Costas",
        sets: [
          { id: "s11", reps: 10, weight: 0, completed: true },
          { id: "s12", reps: 9, weight: 0, completed: true },
          { id: "s13", reps: 8, weight: 0, completed: true },
        ],
      },
      {
        id: "ex5",
        name: "Remada Curvada",
        muscleGroup: "Costas",
        sets: [
          { id: "s14", reps: 12, weight: 70, completed: true },
          { id: "s15", reps: 10, weight: 75, completed: true },
          { id: "s16", reps: 8, weight: 80, completed: true },
        ],
      },
      {
        id: "ex6",
        name: "Rosca Direta",
        muscleGroup: "Bíceps",
        sets: [
          { id: "s17", reps: 12, weight: 30, completed: true },
          { id: "s18", reps: 10, weight: 35, completed: true },
          { id: "s19", reps: 8, weight: 35, completed: true },
        ],
      },
    ],
  },
  {
    id: "w3",
    name: "Pernas e Glúteos",
    date: "2025-03-21T07:45:00Z",
    duration: 80,
    totalVolume: 18500,
    location: {
      latitude: -23.5605,
      longitude: -46.6456,
      gym: "Bodytech - Paulista",
      address: "Rua Augusta, 500 - São Paulo",
    },
    exercises: [
      {
        id: "ex7",
        name: "Agachamento",
        muscleGroup: "Pernas",
        sets: [
          { id: "s20", reps: 12, weight: 100, completed: true },
          { id: "s21", reps: 10, weight: 110, completed: true },
          { id: "s22", reps: 8, weight: 120, completed: true },
          { id: "s23", reps: 8, weight: 120, completed: true },
        ],
      },
      {
        id: "ex8",
        name: "Leg Press",
        muscleGroup: "Pernas",
        sets: [
          { id: "s24", reps: 15, weight: 180, completed: true },
          { id: "s25", reps: 12, weight: 200, completed: true },
          { id: "s26", reps: 10, weight: 220, completed: true },
        ],
      },
      {
        id: "ex9",
        name: "Hip Thrust",
        muscleGroup: "Glúteos",
        sets: [
          { id: "s27", reps: 12, weight: 80, completed: true },
          { id: "s28", reps: 10, weight: 90, completed: true },
          { id: "s29", reps: 10, weight: 90, completed: true },
        ],
      },
    ],
  },
  {
    id: "w4",
    name: "Ombros e Abdômen",
    date: "2025-03-19T18:00:00Z",
    duration: 55,
    totalVolume: 5200,
    exercises: [
      {
        id: "ex10",
        name: "Desenvolvimento",
        muscleGroup: "Ombros",
        sets: [
          { id: "s30", reps: 12, weight: 50, completed: true },
          { id: "s31", reps: 10, weight: 55, completed: true },
          { id: "s32", reps: 8, weight: 60, completed: true },
        ],
      },
      {
        id: "ex11",
        name: "Elevação Lateral",
        muscleGroup: "Ombros",
        sets: [
          { id: "s33", reps: 15, weight: 12, completed: true },
          { id: "s34", reps: 12, weight: 14, completed: true },
          { id: "s35", reps: 12, weight: 14, completed: true },
        ],
      },
      {
        id: "ex12",
        name: "Abdominal Crunch",
        muscleGroup: "Abdômen",
        sets: [
          { id: "s36", reps: 20, weight: 0, completed: true },
          { id: "s37", reps: 20, weight: 0, completed: true },
          { id: "s38", reps: 15, weight: 0, completed: true },
        ],
      },
    ],
  },
  {
    id: "w5",
    name: "Cardio HIIT",
    date: "2025-03-18T06:30:00Z",
    duration: 35,
    totalVolume: 0,
    exercises: [
      {
        id: "ex13",
        name: "Esteira",
        muscleGroup: "Cardio",
        sets: [{ id: "s39", reps: 1, weight: 0, completed: true }],
      },
      {
        id: "ex14",
        name: "Burpees",
        muscleGroup: "Full Body",
        sets: [
          { id: "s40", reps: 15, weight: 0, completed: true },
          { id: "s41", reps: 12, weight: 0, completed: true },
          { id: "s42", reps: 10, weight: 0, completed: true },
        ],
      },
    ],
  },
];

export const MOCK_PROGRESS_PHOTOS: ProgressPhoto[] = [
  {
    id: "p1",
    uri: "https://via.placeholder.com/300",
    date: "2025-03-01T10:00:00Z",
    weight: 84,
    notes: "Início do mês",
  },
  {
    id: "p2",
    uri: "https://via.placeholder.com/300",
    date: "2025-02-01T10:00:00Z",
    weight: 86,
    notes: "Fevereiro",
  },
  {
    id: "p3",
    uri: "https://via.placeholder.com/300",
    date: "2025-01-01T10:00:00Z",
    weight: 88,
    notes: "Início do ano",
  },
];

export const MOCK_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: "m1",
    date: "2025-03-25T10:00:00Z",
    weight: 82,
    bodyFat: 16,
    chest: 104,
    waist: 84,
    hips: 98,
    bicepL: 38,
    thighL: 60,
  },
  {
    id: "m2",
    date: "2025-02-25T10:00:00Z",
    weight: 83,
    bodyFat: 17,
    chest: 103,
    waist: 85,
    hips: 99,
    bicepL: 37.5,
    thighL: 59,
  },
  {
    id: "m3",
    date: "2025-01-25T10:00:00Z",
    weight: 85,
    bodyFat: 18.5,
    chest: 101,
    waist: 87,
    hips: 100,
    bicepL: 37,
    thighL: 58,
  },
];
