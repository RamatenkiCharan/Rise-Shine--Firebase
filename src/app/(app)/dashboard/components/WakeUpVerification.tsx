'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function WakeUpVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const natureImage = PlaceHolderImages.find((img) => img.id === 'wake-up-nature');
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let stream: MediaStream;
    const getCameraPermission = async () => {
      if (hasCameraPermission === null && !isVerified) {
         try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      }
    };

    getCameraPermission();
   
    return () => {
      // Cleanup: stop camera stream when component unmounts or is verified
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVerified, hasCameraPermission, toast]);

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
  
  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleVerification = () => {
    if (!capturedImage) {
      toast({
        variant: 'destructive',
        title: 'No Image Captured',
        description: 'Please take a picture before verifying.',
      });
      return;
    }
    setIsUploading(true);
    // Simulate an upload delay
    setTimeout(() => {
      setIsVerified(true);
      setIsUploading(false);
      toast({
        title: 'Verification Successful!',
        description: 'You\'ve earned +10 streak points for waking up on time.',
      });
    }, 1500);
  };

  if (isVerified) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Verified for Today
          </CardTitle>
          <CardDescription>Great job starting your day right! See you tomorrow.</CardDescription>
        </CardHeader>
        <CardContent>
          {capturedImage ? (
            <div className="aspect-[4/3] relative rounded-md overflow-hidden">
              <Image
                src={capturedImage}
                alt="Verified morning snap"
                fill
                className="object-cover"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               <p className="absolute bottom-2 left-2 text-white text-xs">Your verification photo for today.</p>
            </div>
          ) : natureImage && (
             <div className="aspect-[4/3] relative rounded-md overflow-hidden">
              <Image
                src={natureImage.imageUrl}
                alt={natureImage.description}
                fill
                className="object-cover transition-transform hover:scale-105"
                data-ai-hint={natureImage.imageHint}
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               <p className="absolute bottom-2 left-2 text-white text-xs">Your verification photo for today.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Morning Verification</CardTitle>
        <CardDescription>
          It&apos;s a new day! Take a photo of your morning environment to start your streak.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center p-6">
        <div className="w-full aspect-video rounded-md overflow-hidden bg-muted mb-4 relative flex items-center justify-center">
            {capturedImage ? (
              <Image src={capturedImage} alt="Captured snap" fill className="object-cover" />
            ) : (
               <>
                 {isClient && <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />}
                 {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                        <Camera className="h-10 w-10 mb-2" />
                        <p className="font-semibold">Camera Access Needed</p>
                        <p className="text-xs">Please allow camera access in your browser to continue.</p>
                    </div>
                 )}
               </>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature. You might need to refresh the page after granting permission.
              </AlertDescription>
            </Alert>
        )}

        {capturedImage ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button size="lg" onClick={handleRetake} variant="outline" disabled={isUploading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button size="lg" onClick={handleVerification} disabled={isUploading}>
              {isUploading ? 'Verifying...' : 'Verify Snap'}
            </Button>
          </div>
        ) : (
          <Button size="lg" onClick={handleCapture} disabled={!hasCameraPermission || isUploading}>
            <Camera className="mr-2 h-5 w-5" />
            Take Snap
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          Take a picture of nature to earn bonus points. Avoid AI-generated images.
        </p>
      </CardContent>
    </Card>
  );
}
