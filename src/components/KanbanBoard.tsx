import { useState } from 'react';
import { CircleDot, AlertTriangle, CheckCircle2, Clock, Cog } from 'lucide-react';
import { SwimLane } from './SwimLane';
import { TaskDetailDialog } from './TaskDetailDialog';
import { useMachineContext } from '@/context/MachineContext';
import type { Task, TaskStatus } from '@/types/machine';
import { STATUS_COLUMNS } from '@/types/machine';
import { Button } from '@/components/ui/button';

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  'pending': <Clock className="h-3.5 w-3.5" />,
  'in-progress': <CircleDot className="h-3.5 w-3.5" />,
  'blocked': <AlertTriangle className="h-3.5 w-3.5" />,
  'completed': <CheckCircle2 className="h-3.5 w-3.5" />,
};

const statusColorClasses: Record<TaskStatus, string> = {
  'pending': 'text-status-pending',
  'in-progress': 'text-status-in-progress',
  'blocked': 'text-status-blocked',
  'completed': 'text-status-completed',
};

interface KanbanBoardProps {
  onAddMachine: () => void;
}

export function KanbanBoard({ onAddMachine }: KanbanBoardProps) {
  const { machines, tasks, getTasksForMachine } = useMachineContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const getColumnCount = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).length;

  if (machines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Cog className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">No machines yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first machine to start tracking commissioning tasks.
          </p>
        </div>
        <Button onClick={onAddMachine} className="mt-2 gap-1.5">
          Add Machine
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1100px]">
          {/* Column headers */}
          <div className="sticky top-0 z-20 grid grid-cols-[240px_1fr_1fr_1fr_1fr] border-b border-border bg-background">
            <div className="sticky left-0 z-30 border-r border-border bg-background px-3 py-2.5">
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Machine
              </span>
            </div>
            {STATUS_COLUMNS.map(col => (
              <div
                key={col.key}
                className="flex items-center justify-center gap-2 border-r border-border px-3 py-2.5 last:border-r-0"
              >
                <span className={statusColorClasses[col.key]}>
                  {statusIcons[col.key]}
                </span>
                <span className="text-xs font-medium text-foreground">{col.label}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {getColumnCount(col.key)}
                </span>
              </div>
            ))}
          </div>

          {/* Swimlane rows */}
          {machines.map(machine => (
            <SwimLane
              key={machine.id}
              machine={machine}
              tasks={getTasksForMachine(machine.id)}
              onOpenDetail={openDetail}
            />
          ))}
        </div>
      </div>

      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
