import { Plus, Cog, CircleDot, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMachineContext } from '@/context/MachineContext';

interface HeaderProps {
  onAddMachine: () => void;
}

export function Header({ onAddMachine }: HeaderProps) {
  const { tasks, machines } = useMachineContext();

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
          <h1 className="font-heading text-lg font-bold tracking-tight text-foreground">
            CommTrack
          </h1>
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
