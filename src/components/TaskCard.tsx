import { MoreHorizontal, User, StickyNote } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMachineContext } from '@/context/MachineContext';
import type { Task, TaskStatus } from '@/types/machine';
import { STATUS_COLUMNS } from '@/types/machine';

interface TaskCardProps {
  task: Task;
  onOpenDetail: (task: Task) => void;
}

const statusBorderColors: Record<TaskStatus, string> = {
  'pending': 'border-l-status-pending',
  'in-progress': 'border-l-status-in-progress',
  'blocked': 'border-l-status-blocked',
  'completed': 'border-l-status-completed',
};

export function TaskCard({ task, onOpenDetail }: TaskCardProps) {
  const { updateTaskStatus } = useMachineContext();

  return (
    <div
      className={`group relative cursor-pointer rounded-md border border-border border-l-2 ${statusBorderColors[task.status]} bg-card p-2.5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 animate-slide-in`}
      onClick={() => onOpenDetail(task)}
    >
      <div className="flex items-start justify-between gap-1.5">
        <h4 className="text-[13px] font-medium leading-snug text-card-foreground">
          {task.title}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={e => e.stopPropagation()}
            className="shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs">Move to</DropdownMenuLabel>
            {STATUS_COLUMNS.filter(c => c.key !== task.status).map(col => (
              <DropdownMenuItem
                key={col.key}
                onClick={e => {
                  e.stopPropagation();
                  updateTaskStatus(task.id, col.key);
                }}
                className="text-xs"
              >
                {col.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onOpenDetail(task);
              }}
              className="text-xs"
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-secondary-foreground">
          {task.category}
        </span>
        {task.assignee && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <User className="h-2.5 w-2.5" />
            {task.assignee}
          </span>
        )}
        {task.notes && (
          <StickyNote className="h-2.5 w-2.5 text-primary/60" />
        )}
      </div>
    </div>
  );
}
