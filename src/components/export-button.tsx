'use client';

import { Download } from 'lucide-react';
import type { LoggedActivity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  activities: LoggedActivity[];
}

export function ExportButton({ activities }: ExportButtonProps) {
  const { toast } = useToast();

  const handleExport = () => {
    if (activities.length === 0) {
      toast({
        title: "No data to export",
        description: "Log some activities before exporting.",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Client/Case", "Description", "Duration (seconds)", "Logged At"];
    const rows = activities.map(act => [
      `"${act.client.replace(/"/g, '""')}"`,
      `"${act.description.replace(/"/g, '""')}"`,
      act.duration,
      `"${new Date(act.loggedAt).toISOString()}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `timelock_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    
    toast({
        title: "Export successful",
        description: "Your activity log has been downloaded as a CSV file.",
    });
  };

  return (
    <Button onClick={handleExport}>
      <Download className="mr-2" />
      Export to CSV
    </Button>
  );
}
