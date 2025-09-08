'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LoggedActivity } from '@/lib/types';
import { Header } from '@/components/header';
import { TimeTracker } from '@/components/time-tracker';
import { ActivityList } from '@/components/activity-list';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

const LOCAL_STORAGE_KEY = 'timelock_activities';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>([]);
  
  const [elapsedTime, setElapsedTime] = useState(0); // Accumulated time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);

  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setLoggedActivities(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to parse activities from localStorage", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loggedActivities));
    }
  }, [loggedActivities, hydrated]);

  const handleStart = useCallback(() => {
    if (!client.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a client/case and a description before starting the timer.",
        variant: "destructive",
      });
      return;
    }
    if (!isRunning && elapsedTime === 0) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }, [client, description, isRunning, elapsedTime, toast]);

  const handlePause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setElapsedTime(prev => prev + (Date.now() - startTimeRef.current) / 1000);
    }
  }, [isRunning]);

  const handleResume = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }, [isRunning]);

  const handleLog = useCallback(() => {
    handlePause(); // Ensure timer is paused and time is updated
    const finalDuration = Math.floor(elapsedTime);

    if (finalDuration > 0) {
      const newActivity: LoggedActivity = {
        id: Date.now().toString(),
        client,
        description,
        duration: finalDuration,
        loggedAt: new Date().toISOString(),
      };
      setLoggedActivities(prev => [newActivity, ...prev]);
    }
    
    setClient('');
    setDescription('');
    setElapsedTime(0);
  }, [client, description, elapsedTime, handlePause]);

  const handleDelete = useCallback((id: string) => {
    setLoggedActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

  const totalDuration = isRunning 
    ? elapsedTime + (Date.now() - startTimeRef.current) / 1000
    : elapsedTime;

  if (!hydrated) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activities={loggedActivities} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-8">
          <TimeTracker
            client={client}
            setClient={setClient}
            description={description}
            setDescription={setDescription}
            duration={totalDuration}
            isRunning={isRunning}
            isPaused={!isRunning && elapsedTime > 0}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onLog={handleLog}
          />
          <ActivityList activities={loggedActivities} onDelete={handleDelete} />
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>TimeLock &copy; {new Date().getFullYear()}. All data is stored locally on your device.</p>
      </footer>
    </div>
  );
}
