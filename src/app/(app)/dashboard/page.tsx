import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import WakeUpVerification from "./components/WakeUpVerification";
import DailyTasks from "./components/DailyTasks";
import StreakChart from "./components/StreakChart";
import { Flame, Star, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 Days</div>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,520</div>
              <p className="text-xs text-muted-foreground">Equivalent to ₹9,040</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Beginner</div>
              <p className="text-xs text-muted-foreground">Next: Intermediate</p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Redeemable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹9,040</div>
              <p className="text-xs text-muted-foreground">Ready to cash out</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Weekly Progress</CardTitle>
            <CardDescription>Your streak points over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <StreakChart />
          </CardContent>
        </Card>

        <DailyTasks />
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
         <WakeUpVerification />
      </div>
    </div>
  );
}
