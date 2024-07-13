export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  author: string;
  created_at: string;
  due_date: string;
  color: string;
  assigned: string[];
  subtasks: string[];
}

export interface Subtask {
  id?: number;
  title: string;
  task_id: string;
  author: string;
  status: boolean;
}
