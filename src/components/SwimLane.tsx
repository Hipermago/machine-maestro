import { ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useMachineContext } from '@/context/MachineContext';
import type { Machine, Task, TaskStatus } from '@/types/machine';
import { STATUS_COLUMNS } from '@/types/machine';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SwimLaneProps {
  machine: Machine;
  tasks: Task[];
  onOpenDetail: (task: Task) => void;
}

const columnBgClasses: Record<TaskStatus, string> = {
  'pending': 'bg-column-pending',
  'in-progress': 'bg-column-in-progress',
  'blocked': 'bg-column-blocked',
  'completed': 'bg-column-completed',
};

export function SwimLane({ machine, tasks, onOpenDetail }: SwimLaneProps) {
  const [expanded, setExpanded] = useState(true);
  const { deleteMachine } = useMachineContext();

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <div className="border-b border-border">
      {/* Machine row header */}
      <div className="grid grid-cols-[240px_1fr_1fr_1fr_1fr]">
        {/* Machine info cell */}
        <div className="sticky left-0 z-10 flex items-center gap-2 border-r border-border bg-card p-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 rounded p-0.5 transition-colors hover:bg-accent"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-heading text-sm font-semibold text-foreground">
                {machine.name}
              </h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="shrink-0 rounded p-0.5 opacity-0 transition-all hover:bg-destructive/10 group-hover:opacity-100 [.border-b:hover_&]:opacity-100">
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {machine.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this machine and all its commissioning tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMachine(machine.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-status-completed transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* Status column cells - collapsed shows counts */}
        {!expanded && STATUS_COLUMNS.map(col => {
          const count = tasksByStatus(col.key).length;
          return (
            <div key={col.key} className={`${columnBgClasses[col.key]} flex items-center justify-center border-r border-border last:border-r-0 p-3`}>
              {count > 0 && (
                <span className="font-mono text-xs text-muted-foreground">{count}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded task grid */}
      {expanded && (
        <div className="grid grid-cols-[240px_1fr_1fr_1fr_1fr]">
          {/* Empty machine cell */}
          <div className="sticky left-0 z-10 border-r border-border bg-card" />

          {/* Task cards per status */}
          {STATUS_COLUMNS.map(col => {
            const colTasks = tasksByStatus(col.key);
            return (
              <div
                key={col.key}
                className={`${columnBgClasses[col.key]} min-h-[80px] space-y-2 border-r border-border p-2 last:border-r-0`}
              >
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
                ))}
                {colTasks.length === 0 && (
                  <div className="flex h-full min-h-[60px] items-center justify-center">
                    <span className="text-[11px] text-muted-foreground/40">—</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
