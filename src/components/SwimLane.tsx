import { ChevronRight, ChevronDown, Trash2, Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useMachineContext } from '@/context/MachineContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Machine, Task, TaskStatus } from '@/types/machine';
import { STATUS_COLUMNS } from '@/types/machine';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
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
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(machine.name);
  const { deleteMachine, renameMachine, updateMachineNotes } = useMachineContext();

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed) renameMachine(machine.id, trimmed);
    else setNameValue(machine.name);
    setEditingName(false);
  };

  // grid: machine label | 4 status columns | notes column
  const gridCols = 'grid-cols-[240px_1fr_1fr_1fr_1fr_200px]';

  return (
    <div className="border-b border-border">
      {/* Machine row header */}
      <div className={`grid ${gridCols}`}>
        <div className="sticky left-0 z-10 flex items-center gap-2 border-r border-border bg-card p-3">
          <button onClick={() => setExpanded(!expanded)} className="shrink-0 rounded p-0.5 transition-colors hover:bg-accent">
            {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {editingName ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={nameValue}
                    onChange={e => setNameValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setNameValue(machine.name); setEditingName(false); } }}
                    className="h-6 w-28 text-xs font-semibold"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="rounded p-0.5 hover:bg-accent"><Check className="h-3 w-3 text-status-completed" /></button>
                  <button onClick={() => { setNameValue(machine.name); setEditingName(false); }} className="rounded p-0.5 hover:bg-accent"><X className="h-3 w-3 text-muted-foreground" /></button>
                </div>
              ) : (
                <>
                  <h3 className="truncate font-heading text-sm font-semibold text-foreground">{machine.name}</h3>
                  <button onClick={() => { setNameValue(machine.name); setEditingName(true); }} className="shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-accent [.border-b:hover_&]:opacity-100">
                    <Pencil className="h-2.5 w-2.5 text-muted-foreground" />
                  </button>
                </>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="shrink-0 rounded p-0.5 opacity-0 transition-all hover:bg-destructive/10 [.border-b:hover_&]:opacity-100">
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {machine.name}?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently remove this machine and all its commissioning tasks.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMachine(machine.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-status-completed transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{completedCount}/{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Collapsed counts */}
        {!expanded && STATUS_COLUMNS.map(col => {
          const count = tasksByStatus(col.key).length;
          return (
            <div key={col.key} className={`${columnBgClasses[col.key]} flex items-center justify-center border-r border-border p-3`}>
              {count > 0 && <span className="font-mono text-xs text-muted-foreground">{count}</span>}
            </div>
          );
        })}
        {/* Collapsed notes preview */}
        {!expanded && (
          <div className="flex items-center border-r border-border bg-surface p-3 last:border-r-0">
            {machine.notes && <span className="truncate text-[11px] text-muted-foreground">{machine.notes}</span>}
          </div>
        )}
      </div>

      {/* Expanded task grid */}
      {expanded && (
        <div className={`grid ${gridCols}`}>
          <div className="sticky left-0 z-10 border-r border-border bg-card" />

          {STATUS_COLUMNS.map(col => {
            const colTasks = tasksByStatus(col.key);
            return (
              <div key={col.key} className={`${columnBgClasses[col.key]} min-h-[80px] space-y-2 border-r border-border p-2`}>
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

          {/* Notes column */}
          <div className="border-r border-border bg-surface p-2 last:border-r-0">
            <Textarea
              value={machine.notes}
              onChange={e => updateMachineNotes(machine.id, e.target.value)}
              placeholder="Machine notes..."
              className="min-h-[80px] resize-none border-0 bg-transparent p-1 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
