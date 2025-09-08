'use client';

import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Square, SkipForward } from 'lucide-react';

interface TimeTrackerProps {
  client: string;
  setClient: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  duration: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onLog: () => void;
}

export function TimeTracker({
  client,
  setClient,
  description,
  setDescription,
  duration,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onLog,
}: TimeTrackerProps) {
  const [displayTime, setDisplayTime] = useState('00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(formatDuration(duration));
    }, isRunning ? 50 : 1000); // Update faster when running for smooth display

    setDisplayTime(formatDuration(duration)); // Initial update

    return () => clearInterval(interval);
  }, [duration, isRunning]);
  
  const hasTime = duration > 0;

  return (
    <Card className="overflow-hidden">
      <div className="md:grid md:grid-cols-3">
        <div className="p-6 md:col-span-2">
          <CardHeader className="p-0 mb-4">
            <CardTitle>Active Timer</CardTitle>
            <CardDescription>Track your current task here.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="client" className="text-sm font-medium">Client / Case</label>
                <Input 
                  id="client" 
                  placeholder="e.g. Acme Corp Merger" 
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  disabled={isRunning || isPaused}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                placeholder="e.g. Drafting closing arguments"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isRunning || isPaused}
                className="mt-1"
              />
            </div>
          </CardContent>
        </div>
        <div className="bg-muted/50 p-6 flex flex-col justify-center items-center gap-4 text-center">
            <p className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-primary">
                {displayTime}
            </p>
            <div className="flex items-center gap-2">
            {!isRunning && !isPaused && (
              <Button size="lg" onClick={onStart}>
                <Play className="mr-2" /> Start
              </Button>
            )}
            {isRunning && (
              <Button size="lg" variant="outline" onClick={onPause}>
                <Pause className="mr-2" /> Pause
              </Button>
            )}
            {isPaused && (
              <Button size="lg" onClick={onResume}>
                <SkipForward className="mr-2" /> Resume
              </Button>
            )}
            <Button size="lg" variant="secondary" onClick={onLog} disabled={!hasTime}>
              <Square className="mr-2" /> Stop & Log
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
