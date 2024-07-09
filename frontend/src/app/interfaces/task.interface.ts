export interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  author: string;
  created_at: string;
  color: string;
  assigned: string[];
  subtasks: string[];
}

export interface Subtask {
  id?: string;
  title: string;
  task: string;
  author: string;
}
