import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMachineContext } from '@/context/MachineContext';
import { TASK_TEMPLATES } from '@/data/taskTemplates';
import { toast } from 'sonner';

interface AddMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMachineDialog({ open, onOpenChange }: AddMachineDialogProps) {
  const { addMachine, machines } = useMachineContext();
  const [name, setName] = useState('');

  const suggestedName = `Machine #${String(machines.length + 1).padStart(2, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const machineName = name.trim() || suggestedName;
    addMachine(machineName);
    toast.success(`"${machineName}" added with ${TASK_TEMPLATES.length} commissioning tasks`);
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading">Add New Machine</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            A full set of {TASK_TEMPLATES.length} commissioning tasks will be created automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="machine-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Machine Name
            </Label>
            <Input
              id="machine-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={suggestedName}
              autoFocus
              className="text-sm"
            />
          </div>

          {/* Template preview */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tasks to create
            </Label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border bg-muted/30 p-2">
              {TASK_TEMPLATES.map((tpl, i) => (
                <div key={tpl.id} className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-foreground">{tpl.title}</span>
                  <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-secondary-foreground">
                    {tpl.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Create Machine
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
