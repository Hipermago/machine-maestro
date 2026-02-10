import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AppState, Machine, Task, TaskStatus, StatusChange } from '@/types/machine';
import { TASK_TEMPLATES } from '@/data/taskTemplates';

const STORAGE_KEY = 'commtrack-state';

const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

function createInitialState(): AppState {
  const machines: Machine[] = [
    { id: generateId(), name: 'CNC Mill #01', createdAt: new Date().toISOString() },
    { id: generateId(), name: 'CNC Mill #02', createdAt: new Date().toISOString() },
    { id: generateId(), name: 'CNC Mill #03', createdAt: new Date().toISOString() },
  ];

  const tasks: Task[] = [];
  const engineers = ['J. Smith', 'A. Johnson', 'R. Garcia'];

  machines.forEach((machine, mi) => {
    TASK_TEMPLATES.forEach((tpl, ti) => {
      let status: TaskStatus = 'pending';
      let assignee: string | undefined;
      let completedAt: string | undefined;
      let completedBy: string | undefined;
      const history: StatusChange[] = [];

      if (mi === 0) {
        if (ti < 4) {
          status = 'completed';
          assignee = engineers[0];
          completedAt = new Date().toISOString();
          completedBy = engineers[0];
          history.push({ from: 'pending', to: 'completed', timestamp: new Date().toISOString(), by: engineers[0] });
        } else if (ti < 6) {
          status = 'in-progress';
          assignee = engineers[0];
          history.push({ from: 'pending', to: 'in-progress', timestamp: new Date().toISOString(), by: engineers[0] });
        } else if (ti === 6) {
          status = 'blocked';
          assignee = engineers[0];
          history.push({ from: 'pending', to: 'in-progress', timestamp: new Date().toISOString(), by: engineers[0] });
          history.push({ from: 'in-progress', to: 'blocked', timestamp: new Date().toISOString(), by: engineers[0] });
        }
      } else if (mi === 1) {
        if (ti < 2) {
          status = 'completed';
          assignee = engineers[1];
          completedAt = new Date().toISOString();
          completedBy = engineers[1];
          history.push({ from: 'pending', to: 'completed', timestamp: new Date().toISOString(), by: engineers[1] });
        } else if (ti < 4) {
          status = 'in-progress';
          assignee = engineers[1];
          history.push({ from: 'pending', to: 'in-progress', timestamp: new Date().toISOString(), by: engineers[1] });
        }
      }

      tasks.push({
        id: generateId(),
        machineId: machine.id,
        templateId: tpl.id,
        title: tpl.title,
        description: tpl.description,
        status,
        assignee,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt,
        completedBy,
        statusHistory: history,
        category: tpl.category,
        order: tpl.order,
      });
    });
  });

  return { machines, tasks };
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.machines?.length >= 0 && parsed.tasks?.length >= 0) return parsed;
    }
  } catch { /* fallthrough */ }
  return createInitialState();
}

type Action =
  | { type: 'ADD_MACHINE'; payload: { name: string } }
  | { type: 'DELETE_MACHINE'; payload: { machineId: string } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: TaskStatus; updatedBy?: string } }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Pick<Task, 'notes' | 'assignee'>> } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_MACHINE': {
      const machine: Machine = {
        id: generateId(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
      };

      const newTasks: Task[] = TASK_TEMPLATES.map(tpl => ({
        id: generateId(),
        machineId: machine.id,
        templateId: tpl.id,
        title: tpl.title,
        description: tpl.description,
        status: 'pending' as TaskStatus,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [],
        category: tpl.category,
        order: tpl.order,
      }));

      return {
        machines: [...state.machines, machine],
        tasks: [...state.tasks, ...newTasks],
      };
    }

    case 'DELETE_MACHINE': {
      return {
        machines: state.machines.filter(m => m.id !== action.payload.machineId),
        tasks: state.tasks.filter(t => t.machineId !== action.payload.machineId),
      };
    }

    case 'UPDATE_TASK_STATUS': {
      const { taskId, status, updatedBy } = action.payload;
      const now = new Date().toISOString();

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id !== taskId) return task;

          const historyEntry: StatusChange = {
            from: task.status,
            to: status,
            timestamp: now,
            by: updatedBy || task.assignee,
          };

          return {
            ...task,
            status,
            updatedAt: now,
            completedAt: status === 'completed' ? now : undefined,
            completedBy: status === 'completed' ? (updatedBy || task.assignee) : undefined,
            statusHistory: [...task.statusHistory, historyEntry],
          };
        }),
      };
    }

    case 'UPDATE_TASK': {
      const { taskId, updates } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        ),
      };
    }

    default:
      return state;
  }
}

interface MachineContextType {
  machines: Machine[];
  tasks: Task[];
  addMachine: (name: string) => void;
  deleteMachine: (machineId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, updatedBy?: string) => void;
  updateTask: (taskId: string, updates: Partial<Pick<Task, 'notes' | 'assignee'>>) => void;
  getTasksForMachine: (machineId: string) => Task[];
}

const MachineContext = createContext<MachineContextType | null>(null);

export function MachineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMachine = useCallback((name: string) => {
    dispatch({ type: 'ADD_MACHINE', payload: { name } });
  }, []);

  const deleteMachine = useCallback((machineId: string) => {
    dispatch({ type: 'DELETE_MACHINE', payload: { machineId } });
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus, updatedBy?: string) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status, updatedBy } });
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Pick<Task, 'notes' | 'assignee'>>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  }, []);

  const getTasksForMachine = useCallback((machineId: string) => {
    return state.tasks
      .filter(t => t.machineId === machineId)
      .sort((a, b) => a.order - b.order);
  }, [state.tasks]);

  return (
    <MachineContext.Provider value={{
      machines: state.machines,
      tasks: state.tasks,
      addMachine,
      deleteMachine,
      updateTaskStatus,
      updateTask,
      getTasksForMachine,
    }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachineContext() {
  const ctx = useContext(MachineContext);
  if (!ctx) throw new Error('useMachineContext must be used within MachineProvider');
  return ctx;
}
