'use client';

import { LoggedActivity } from '@/lib/types';
import { AiSummary } from './ai-summary';
import { ExportButton } from './export-button';
import { Briefcase } from 'lucide-react';

interface HeaderProps {
    activities: LoggedActivity[];
}

export function Header({ activities }: HeaderProps) {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">TimeLock</h1>
        </div>
        <div className="flex items-center gap-2">
          <AiSummary activities={activities} />
          <ExportButton activities={activities} />
        </div>
      </div>
    </header>
  );
}
