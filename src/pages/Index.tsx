import { useState } from 'react';
import { MachineProvider } from '@/context/MachineContext';
import { Header } from '@/components/Header';
import { KanbanBoard } from '@/components/KanbanBoard';
import { AddMachineDialog } from '@/components/AddMachineDialog';

const Index = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <MachineProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header onAddMachine={() => setAddDialogOpen(true)} />
        <KanbanBoard onAddMachine={() => setAddDialogOpen(true)} />
        <AddMachineDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      </div>
    </MachineProvider>
  );
};

export default Index;
