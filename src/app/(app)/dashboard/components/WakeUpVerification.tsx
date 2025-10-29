'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WakeUpVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const natureImage = PlaceHolderImages.find((img) => img.id === 'wake-up-nature');

  const handleVerification = () => {
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
          {natureImage && (
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
      <CardContent className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Camera className="w-12 h-12 text-primary" />
        </div>
        <Button size="lg" onClick={handleVerification} disabled={isUploading}>
          {isUploading ? 'Verifying...' : 'I\'m Awake! Verify'}
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Take a picture of nature to earn bonus points. Avoid AI-generated images.
        </p>
      </CardContent>
    </Card>
  );
}
