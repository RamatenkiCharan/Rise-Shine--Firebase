import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import WakeUpVerification from "./components/WakeUpVerification";
import DailyTasks from "./components/DailyTasks";
import StreakChart from "./components/StreakChart";
import { Flame, Star, Zap, Footprints } from "lucide-react";

const totalPoints = 4520;
const pointsPerRupee = 100;
const redeemableValue = totalPoints / pointsPerRupee;

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
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">₹{redeemableValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} redeemable</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Distance Walked</CardTitle>
              <Footprints className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.4 km</div>
              <p className="text-xs text-muted-foreground">Today's progress</p>
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
