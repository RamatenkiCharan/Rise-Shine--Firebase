'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { personalizedDietPlan, type PersonalizedDietPlanOutput } from '@/ai/flows/personalized-diet-plans';
import { dietFromIngredients, type DietFromIngredientsOutput } from '@/ai/flows/diet-from-ingredients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const dietPlanSchema = z.object({
  weightKg: z.coerce.number().min(30, 'Weight must be at least 30 kg'),
  heightCm: z.coerce.number().min(100, 'Height must be at least 100 cm'),
  goal: z.enum(['weight loss', 'weight gain', 'maintain weight']),
  dietaryPreferences: z.string().optional(),
});

const ingredientsSchema = z.object({
  ingredients: z.string().min(10, 'Please list at least a few ingredients.'),
});

type DietPlanFormValues = z.infer<typeof dietPlanSchema>;
type IngredientsFormValues = z.infer<typeof ingredientsSchema>;

export default function DietPage() {
  const [personalizedPlan, setPersonalizedPlan] = useState<PersonalizedDietPlanOutput | null>(null);
  const [ingredientPlan, setIngredientPlan] = useState<DietFromIngredientsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const dietForm = useForm<DietPlanFormValues>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues: {
      weightKg: 70,
      heightCm: 175,
      goal: 'maintain weight',
      dietaryPreferences: '',
    },
  });

  const ingredientsForm = useForm<IngredientsFormValues>({
    resolver: zodResolver(ingredientsSchema),
    defaultValues: {
      ingredients: '',
    },
  });

  async function onDietSubmit(values: DietPlanFormValues) {
    setIsLoading(true);
    setPersonalizedPlan(null);
    try {
      const result = await personalizedDietPlan(values);
      setPersonalizedPlan(result);
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

  async function onIngredientsSubmit(values: IngredientsFormValues) {
    setIsLoading(true);
    setIngredientPlan(null);
    try {
      const result = await dietFromIngredients(values);
      setIngredientPlan(result);
    } catch (error) {
      console.error('Failed to generate diet plan from ingredients:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate your diet plan. Please try again later.',
      });
    }
    setIsLoading(false);
  }

  return (
    <Tabs defaultValue="personalized">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personalized">Personalized Plan</TabsTrigger>
        <TabsTrigger value="ingredients">From My Ingredients</TabsTrigger>
      </TabsList>
      <TabsContent value="personalized">
        <div className="grid gap-8 md:grid-cols-3 mt-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Personalized Diet Plan</CardTitle>
                <CardDescription>
                  Fill in your details to generate a custom meal plan powered by AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...dietForm}>
                  <form onSubmit={dietForm.handleSubmit(onDietSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={dietForm.control}
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
                        control={dietForm.control}
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
                      control={dietForm.control}
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
                      control={dietForm.control}
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
            {isLoading && !personalizedPlan &&(
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Our AI chef is cooking up your plan...</p>
                </div>
              </div>
            )}
            {personalizedPlan ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Your AI-Generated Diet Plan</CardTitle>
                    <CardDescription>A plan tailored just for you to help you reach your goals.</CardDescription>
                  </CardHeader>
                  <CardContent className="whitespace-pre-wrap font-body text-sm">{personalizedPlan.dietPlan}</CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Macronutrients</CardTitle>
                    </CardHeader>
                    <CardContent className="whitespace-pre-wrap font-body text-sm">{personalizedPlan.macronutrientRatios}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Vitamins & Minerals</CardTitle>
                    </CardHeader>
                    <CardContent className="whitespace-pre-wrap font-body text-sm">{personalizedPlan.vitaminAndMineralSuggestions}</CardContent>
                  </Card>
                </div>
                 <Card>
                  <CardHeader>
                    <CardTitle>Calorie Burn Suggestion</CardTitle>
                  </CardHeader>
                  <CardContent className="whitespace-pre-wrap font-body text-sm">{personalizedPlan.caloriesBurnedSuggestion}</CardContent>
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
      </TabsContent>

      <TabsContent value="ingredients">
         <div className="grid gap-8 md:grid-cols-3 mt-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">What's in Your Kitchen?</CardTitle>
                <CardDescription>
                  List the ingredients you have, and our AI will create a meal plan for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...ingredientsForm}>
                  <form onSubmit={ingredientsForm.handleSubmit(onIngredientsSubmit)} className="space-y-6">
                    <FormField
                      control={ingredientsForm.control}
                      name="ingredients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Ingredients</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Chicken breast, broccoli, brown rice, olive oil, garlic..."
                              className="min-h-[150px]"
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
                          Creating Plan...
                        </>
                      ) : (
                        'Create Meal Plan'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            {isLoading && !ingredientPlan && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Thinking of tasty recipes...</p>
                </div>
              </div>
            )}
            {ingredientPlan ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Your Ingredient-Based Diet Plan</CardTitle>
                    <CardDescription>A one-day meal plan created from the items you have.</CardDescription>
                  </CardHeader>
                  <CardContent className="whitespace-pre-wrap font-body text-sm">{ingredientPlan.dietPlan}</CardContent>
                </Card>
                {ingredientPlan.shoppingListSuggestions && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shopping List Suggestions</CardTitle>
                      <CardDescription>A few extra items to complete your meals.</CardDescription>
                    </CardHeader>
                    <CardContent className="whitespace-pre-wrap font-body text-sm">{ingredientPlan.shoppingListSuggestions}</CardContent>
                  </Card>
                )}
              </div>
            ) : (
              !isLoading && (
                 <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border-2 border-dashed bg-card">
                  <div className="text-center">
                    <p className="text-lg font-medium">Your creative meal plan will show up here.</p>
                    <p className="text-muted-foreground">List your ingredients to begin.</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
