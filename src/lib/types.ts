export interface Task {
  id: string;
  title: string;
  completed: boolean;
  duration: number; // in minutes
  streak: number;
  beforeSnap: string | null;
  afterSnap: string | null;
}
