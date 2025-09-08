'use client';

import type { LoggedActivity } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityListProps {
  activities: LoggedActivity[];
  onDelete: (id: string) => void;
}

export function ActivityList({ activities, onDelete }: ActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>A record of all your billable hours.</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Client/Case</TableHead>
                  <TableHead className="w-1/2">Description</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Logged At</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.client}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.description}</TableCell>
                    <TableCell className="text-right font-mono">{formatDuration(activity.duration)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(activity.loggedAt).toLocaleDateString()} {new Date(activity.loggedAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(activity.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Entry</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Activities Logged Yet</h3>
            <p className="text-muted-foreground">Start the timer to begin tracking your time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
