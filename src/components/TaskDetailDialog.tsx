import { useEffect, useState, useMemo } from 'react';
import { Clock, User, CheckCircle2, CircleDot, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMachineContext } from '@/context/MachineContext';
import type { Task, TaskStatus } from '@/types/machine';
import { STATUS_COLUMNS } from '@/types/machine';
import { toast } from 'sonner';

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles: Record<TaskStatus, { bg: string; text: string; border: string }> = {
  'pending': { bg: 'bg-status-pending/10', text: 'text-status-pending', border: 'border-status-pending/30' },
  'in-progress': { bg: 'bg-status-in-progress/10', text: 'text-status-in-progress', border: 'border-status-in-progress/30' },
  'blocked': { bg: 'bg-status-blocked/10', text: 'text-status-blocked', border: 'border-status-blocked/30' },
  'completed': { bg: 'bg-status-completed/10', text: 'text-status-completed', border: 'border-status-completed/30' },
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  'pending': <Clock className="h-3.5 w-3.5" />,
  'in-progress': <CircleDot className="h-3.5 w-3.5" />,
  'blocked': <AlertTriangle className="h-3.5 w-3.5" />,
  'completed': <CheckCircle2 className="h-3.5 w-3.5" />,
};

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const { updateTaskStatus, updateTask, machines } = useMachineContext();

  const [status, setStatus] = useState<TaskStatus>('pending');
  const [assignee, setAssignee] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      setAssignee(task.assignee || '');
      setNotes(task.notes || '');
    }
  }, [task]);

  const machine = useMemo(() => {
    if (!task) return null;
    return machines.find(m => m.id === task.machineId);
  }, [task, machines]);

  const handleSave = () => {
    if (!task) return;

    if (status !== task.status) {
      updateTaskStatus(task.id, status, assignee || undefined);
    }

    updateTask(task.id, {
      assignee: assignee || undefined,
      notes,
    });

    toast.success('Task updated');
    onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">{task.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {task.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Machine & Category */}
          <div className="flex items-center gap-3 text-sm">
            {machine && (
              <span className="rounded bg-secondary px-2 py-0.5 font-heading text-xs font-medium text-secondary-foreground">
                {machine.name}
              </span>
            )}
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {task.category}
            </span>
          </div>

          {/* Status selector */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_COLUMNS.map(col => {
                const isActive = status === col.key;
                const style = statusStyles[col.key];
                return (
                  <button
                    key={col.key}
                    onClick={() => setStatus(col.key)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? `${style.bg} ${style.text} ${style.border}`
                        : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                    }`}
                  >
                    {statusIcons[col.key]}
                    {col.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Assigned To
            </Label>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="assignee"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                placeholder="Engineer name..."
                className="pl-8 text-sm"
              />
            </div>
          </div>

          {/* Technical Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Technical Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record measurements, position increments, SCS limits, speed curves, or any technical observations..."
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Status History */}
          {task.statusHistory.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                History
              </Label>
              <div className="space-y-1.5 rounded-md border border-border bg-muted/30 p-3">
                {[...task.statusHistory].reverse().map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{entry.from.replace('-', ' ')}</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    <span className="capitalize">{entry.to.replace('-', ' ')}</span>
                    {entry.by && <span className="text-foreground/60">by {entry.by}</span>}
                    <span className="ml-auto font-mono text-[10px]">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion info */}
          {task.completedAt && (
            <div className="rounded-md border border-status-completed/20 bg-status-completed/5 p-3 text-xs">
              <span className="text-status-completed">Completed</span>
              {task.completedBy && <span className="text-muted-foreground"> by {task.completedBy}</span>}
              <span className="text-muted-foreground">
                {' '}on {new Date(task.completedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
