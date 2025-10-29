'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { personalizedDietPlan, type PersonalizedDietPlanOutput } from '@/ai/flows/personalized-diet-plans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dietPlanSchema = z.object({
  weightKg: z.coerce.number().min(30, 'Weight must be at least 30 kg'),
  heightCm: z.coerce.number().min(100, 'Height must be at least 100 cm'),
  goal: z.enum(['weight loss', 'weight gain', 'maintain weight']),
  dietaryPreferences: z.string().optional(),
});

type DietPlanFormValues = z.infer<typeof dietPlanSchema>;

export default function DietPage() {
  const [dietPlan, setDietPlan] = useState<PersonalizedDietPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DietPlanFormValues>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues: {
      weightKg: 70,
      heightCm: 175,
      goal: 'maintain weight',
      dietaryPreferences: '',
    },
  });

  async function onSubmit(values: DietPlanFormValues) {
    setIsLoading(true);
    setDietPlan(null);
    try {
      const result = await personalizedDietPlan(values);
      setDietPlan(result);
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate your diet plan. Please try again later.',
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Personalized Diet Plan</CardTitle>
            <CardDescription>
              Fill in your details to generate a custom meal plan powered by AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weightKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weight loss">Weight Loss</SelectItem>
                          <SelectItem value="weight gain">Weight Gain</SelectItem>
                          <SelectItem value="maintain weight">Maintain Weight</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dietaryPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Vegetarian, no nuts, gluten-free..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate My Plan'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isLoading && (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Our AI chef is cooking up your plan...</p>
            </div>
          </div>
        )}
        {dietPlan ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your AI-Generated Diet Plan</CardTitle>
                <CardDescription>A plan tailored just for you to help you reach your goals.</CardDescription>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap font-body text-sm">{dietPlan.dietPlan}</CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Macronutrients</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap font-body text-sm">{dietPlan.macronutrientRatios}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vitamins & Minerals</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap font-body text-sm">{dietPlan.vitaminAndMineralSuggestions}</CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Calorie Burn Suggestion</CardTitle>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap font-body text-sm">{dietPlan.caloriesBurnedSuggestion}</CardContent>
            </Card>
          </div>
        ) : (
          !isLoading && (
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border-2 border-dashed bg-card">
              <div className="text-center">
                <p className="text-lg font-medium">Your diet plan will appear here.</p>
                <p className="text-muted-foreground">Fill out the form to get started.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
