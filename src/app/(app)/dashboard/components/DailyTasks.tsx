'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { type Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getExerciseReminders } from '@/ai/flows/exercise-reminders';
import { cn } from '@/lib/utils';
import { Dumbbell, PlusCircle, BrainCircuit } from 'lucide-react';

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Morning Jog (30 mins)', completed: false, duration: 30, streak: 5 },
  { id: 'task-2', title: 'Hydrate: Drink 500ml of water', completed: false, duration: 5, streak: 2 },
  { id: 'task-3', title: '10-minute Meditation', completed: false, duration: 10, streak: 4 },
];

export default function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [aiTasks, setAiTasks] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAiTasks() {
      try {
        const reminders = await getExerciseReminders({ preferences: 'Outdoor running, 30-45 minutes, morning yoga' });
        // Simple parsing of the reminders string
        const parsedAiTasks = reminders.reminders.split('\n').filter(line => line.trim().length > 0);
        setAiTasks(parsedAiTasks);
      } catch (error) {
        console.error("Failed to fetch AI-powered tasks", error);
      }
    }
    fetchAiTasks();
  }, []);

  const handleTaskToggle = (taskId: string) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed };
          if (updatedTask.completed) {
            toast({
              title: 'Task Completed!',
              description: `Great job! You've earned +${updatedTask.streak} streak points.`,
            });
          }
          return updatedTask;
        }
        return task;
      });
      return newTasks;
    });
  };
  
  const completedTasksCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const progress = useMemo(() => (completedTasksCount / tasks.length) * 100, [completedTasksCount, tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Daily Tasks</CardTitle>
        <CardDescription>Complete at least two tasks to maintain your daily streak.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">{completedTasksCount} of {tasks.length} tasks completed</p>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border p-3 transition-colors",
                task.completed ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
              )}
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => handleTaskToggle(task.id)}
                aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              <label
                htmlFor={task.id}
                className={cn(
                  "flex-1 text-sm font-medium leading-none cursor-pointer",
                  task.completed ? "line-through text-muted-foreground" : ""
                )}
              >
                {task.title}
              </label>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Dumbbell className="h-3 w-3" />
                <span>+{task.streak} pts</span>
              </div>
            </div>
          ))}
        </div>
        
        {aiTasks.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
             <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><BrainCircuit className="h-4 w-4" /> AI Suggestions</h3>
             {aiTasks.map((aiTask, index) => (
               <div key={index} className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                  <p className="flex-1">{aiTask}</p>
                   <Button variant="ghost" size="sm" className="shrink-0"><PlusCircle className="h-4 w-4 mr-2" /> Add to Tasks</Button>
               </div>
             ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
