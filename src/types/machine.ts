export type TaskStatus = 'pending' | 'in-progress' | 'blocked' | 'completed';

export interface StatusChange {
  from: TaskStatus;
  to: TaskStatus;
  timestamp: string;
  by?: string;
}

export interface Task {
  id: string;
  machineId: string;
  templateId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completedBy?: string;
  statusHistory: StatusChange[];
  category: string;
  order: number;
}

export interface Machine {
  id: string;
  name: string;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  order: number;
  category: string;
}

export interface AppState {
  machines: Machine[];
  tasks: Task[];
}

export const STATUS_COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'completed', label: 'Completed' },
];
