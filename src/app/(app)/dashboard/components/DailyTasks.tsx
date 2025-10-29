'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getExerciseReminders } from '@/ai/flows/exercise-reminders';
import { cn } from '@/lib/utils';
import { Dumbbell, PlusCircle, BrainCircuit, Camera, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Morning Jog (30 mins)', completed: false, duration: 30, streak: 5, beforeSnap: null, afterSnap: null },
  { id: 'task-2', title: 'Hydrate: Drink 500ml of water', completed: false, duration: 5, streak: 2, beforeSnap: null, afterSnap: null },
  { id: 'task-3', title: '10-minute Meditation', completed: false, duration: 10, streak: 4, beforeSnap: null, afterSnap: null },
];

function TaskVerificationCamera({ onCapture, task, snapType }: { onCapture: (taskId: string, snapType: 'beforeSnap' | 'afterSnap', dataUrl: string) => void; task: Task; snapType: 'beforeSnap' | 'afterSnap' }) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleRetake = () => setCapturedImage(null);

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(task.id, snapType, capturedImage);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Take {snapType === 'beforeSnap' ? ' "Before"' : ' "After"'} Snap for "{task.title}"</DialogTitle>
      </DialogHeader>
      <div className="w-full aspect-video rounded-md overflow-hidden bg-muted relative flex items-center justify-center">
        {capturedImage ? (
          <Image src={capturedImage} alt="Captured snap" fill className="object-cover" />
        ) : (
          <>
            {isClient && <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />}
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                <Camera className="h-10 w-10 mb-2" />
                <p className="font-semibold">Camera Access Needed</p>
                <p className="text-xs">Please allow camera access.</p>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {hasCameraPermission === false && (
        <Alert variant="destructive">
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access in your browser settings to use this feature.
          </AlertDescription>
        </Alert>
      )}
      <DialogFooter>
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={handleRetake}><RefreshCw className="mr-2 h-4 w-4" />Retake</Button>
            <DialogClose asChild>
              <Button onClick={handleConfirm}><Check className="mr-2 h-4 w-4" />Confirm</Button>
            </DialogClose>
          </>
        ) : (
          <Button onClick={handleCapture} disabled={!hasCameraPermission}>
            <Camera className="mr-2 h-4 w-4" />Capture
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}


export default function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [aiTasks, setAiTasks] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAiTasks() {
      try {
        const reminders = await getExerciseReminders({ preferences: 'Outdoor running, 30-45 minutes, morning yoga' });
        const parsedAiTasks = reminders.reminders.split('\n').filter(line => line.trim().length > 0);
        setAiTasks(parsedAiTasks);
      } catch (error) {
        console.error("Failed to fetch AI-powered tasks", error);
      }
    }
    fetchAiTasks();
  }, []);

  const handleSnapCapture = (taskId: string, snapType: 'beforeSnap' | 'afterSnap', dataUrl: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, [snapType]: dataUrl };
        if (updatedTask.beforeSnap && updatedTask.afterSnap && !updatedTask.completed) {
          // Both snaps are taken, complete the task
          updatedTask.completed = true;
           toast({
              title: 'Task Completed!',
              description: `Great job! You've earned +${updatedTask.streak} streak points for "${updatedTask.title}".`,
            });
        }
        return updatedTask;
      }
      return task;
    }));
  };
  
  const completedTasksCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const progress = useMemo(() => (completedTasksCount / tasks.length) * 100, [completedTasksCount, tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Daily Tasks</CardTitle>
        <CardDescription>Complete at least two tasks to maintain your daily streak. Photo verification is required.</CardDescription>
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
                "flex items-start gap-4 rounded-lg border p-3 transition-colors",
                task.completed ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
                   <Dumbbell className="h-3 w-3" />
                   <span>+{task.streak} pts</span>
                 </div>
                 {task.completed ? (
                   <Check className="h-6 w-6 text-green-500" />
                 ) : (
                   <X className="h-6 w-6 text-destructive" />
                 )}
              </div>
              <div className="flex-1">
                <p className={cn("font-medium leading-none", task.completed && "line-through text-muted-foreground")}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={task.beforeSnap ? 'secondary' : 'outline'} size="sm" disabled={task.completed}>
                        {task.beforeSnap ? <Check className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                        Before
                      </Button>
                    </DialogTrigger>
                    <TaskVerificationCamera onCapture={handleSnapCapture} task={task} snapType="beforeSnap" />
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={task.afterSnap ? 'secondary' : 'outline'} size="sm" disabled={!task.beforeSnap || task.completed}>
                         {task.afterSnap ? <Check className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                        After
                      </Button>
                    </DialogTrigger>
                    <TaskVerificationCamera onCapture={handleSnapCapture} task={task} snapType="afterSnap" />
                  </Dialog>
                </div>
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
