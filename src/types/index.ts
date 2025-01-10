export interface WorkoutSession {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  accuracy: number;
}

export interface UserProgress {
  workoutsCompleted: number;
  totalMinutes: number;
  averageAccuracy: number;
  streak: number;
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  description: string;
  imageUrl: string;
}