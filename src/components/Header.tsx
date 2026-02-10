import { useState } from 'react';
import { Plus, Cog, CircleDot, AlertTriangle, CheckCircle2, Clock, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMachineContext } from '@/context/MachineContext';

interface HeaderProps {
  onAddMachine: () => void;
}

export function Header({ onAddMachine }: HeaderProps) {
  const { tasks, machines, appName, setAppName } = useMachineContext();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(appName);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) setAppName(trimmed);
    else setEditValue(appName);
    setEditing(false);
  };

  const counts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Cog className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          {editing ? (
            <div className="flex items-center gap-1.5">
              <Input
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setEditValue(appName); setEditing(false); } }}
                className="h-7 w-40 text-sm font-bold"
                autoFocus
              />
              <button onClick={handleSave} className="rounded p-0.5 hover:bg-accent"><Check className="h-3.5 w-3.5 text-status-completed" /></button>
              <button onClick={() => { setEditValue(appName); setEditing(false); }} className="rounded p-0.5 hover:bg-accent"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
            </div>
          ) : (
            <div className="group flex items-center gap-1.5">
              <h1 className="font-heading text-lg font-bold tracking-tight text-foreground">{appName}</h1>
              <button onClick={() => { setEditValue(appName); setEditing(true); }} className="rounded p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100">
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {machines.length} machine{machines.length !== 1 ? 's' : ''} · {tasks.length} tasks
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-5 md:flex">
        <StatusPill icon={<Clock className="h-3.5 w-3.5" />} count={counts.pending} label="Pending" className="text-status-pending" />
        <StatusPill icon={<CircleDot className="h-3.5 w-3.5" />} count={counts['in-progress']} label="Active" className="text-status-in-progress" />
        <StatusPill icon={<AlertTriangle className="h-3.5 w-3.5" />} count={counts.blocked} label="Blocked" className="text-status-blocked" />
        <StatusPill icon={<CheckCircle2 className="h-3.5 w-3.5" />} count={counts.completed} label="Done" className="text-status-completed" />
      </div>

      <Button onClick={onAddMachine} size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Add Machine
      </Button>
    </header>
  );
}

function StatusPill({ icon, count, label, className }: { icon: React.ReactNode; count: number; label: string; className: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      {icon}
      <span className="font-mono font-medium">{count}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
