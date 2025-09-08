'use client';

import { useState } from 'react';
import { summarizeActivityLog } from '@/ai/flows/summarize-activity-log';
import type { LoggedActivity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AiSummaryProps {
  activities: LoggedActivity[];
}

export function AiSummary({ activities }: AiSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerateSummary = async () => {
    if (activities.length === 0) {
        setError('You must have at least one logged activity to generate a summary.');
        return;
    }
    
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const input = activities.map(({ description, duration }) => ({
        description,
        timeElapsed: Math.round(duration / 60), // Convert seconds to minutes
      }));

      const result = await summarizeActivityLog(input);
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSummary('');
      setError('');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2" />
          AI Activity Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>AI Activity Summary</DialogTitle>
          <DialogDescription>
            Get an AI-powered summary and categorization of your logged activities.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : summary ? (
            <div className="prose prose-sm max-w-none rounded-md border p-4 whitespace-pre-wrap bg-secondary/50">
                {summary}
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button onClick={handleGenerateSummary} disabled={isLoading || activities.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : summary ? (
              'Regenerate Summary'
            ) : (
              'Generate Summary'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
