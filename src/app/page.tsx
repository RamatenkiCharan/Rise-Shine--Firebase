'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import { 
  initiateEmailSignUp, 
  initiateEmailSignIn, 
  initiateAnonymousSignIn 
} from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleAuthAction = async (action: 'signIn' | 'signUp' | 'anonymous') => {
    setIsLoading(true);
    try {
      if (action === 'signIn') {
        initiateEmailSignIn(auth, loginEmail, loginPassword);
      } else if (action === 'signUp') {
        initiateEmailSignUp(auth, signUpEmail, signUpPassword);
      } else if (action === 'anonymous') {
        initiateAnonymousSignIn(auth);
      }
      // The onAuthStateChanged listener in the layout will handle the redirect.
      // We can show a toast here for better UX.
      toast({ title: 'Success', description: 'Redirecting to your dashboard...' });
      router.push('/dashboard');

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
    // Don't setIsLoading(false) on success, because we are navigating away.
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">HealthStreak</h1>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your wellness journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="name@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="login-password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <Button onClick={() => handleAuthAction('signIn')} className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleAuthAction('anonymous')} disabled={isLoading}>
                  Login as Guest
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                <CardDescription>Start your journey to a healthier you today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="name@example.com" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} required />
                </div>
                <Button onClick={() => handleAuthAction('signUp')} className="w-full" disabled={isLoading}>
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
