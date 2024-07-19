export interface Task {
  id?: string;
  title: string;
  board_id: string;
  description: string;
  priority: string;
  status: string;
  author: string;
  created_at: string;
  due_date: string;
  color: string;
  assigned: string[];
}

export interface Subtask {
  id?: number;
  title: string;
  task_id: number;
  author: string;
  status: boolean;
}
