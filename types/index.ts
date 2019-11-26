export interface Exercise {
  group: string,
  name: string
  link: string
  units: string
  step: number
  amount: number
}

export interface WorkoutItem {
  order: number
  setsTaken: number;
  exercise: Exercise,
  difficulty?: Difficulty
}

export interface Workout {
  date: Date;
  exercises: WorkoutItem[]
}

export const enum Difficulty {veryEasy = 1, easy = 2, medium = 3, hard = 4, veryDifficult = 5}
