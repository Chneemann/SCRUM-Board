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
  id?: string;
  title: string;
  task_id: string;
  author: string;
}
