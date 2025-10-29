import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, Star } from "lucide-react";

const POINTS_PER_RUPEE = 100;
const currentStreaks = 4520;
const currentInrValue = currentStreaks / POINTS_PER_RUPEE;

const redemptionHistory = [
  { id: 1, date: "2024-06-15", streaks: 1000, amount: "₹10", status: "Completed" },
  { id: 2, date: "2024-05-20", streaks: 500, amount: "₹5", status: "Completed" },
  { id: 3, date: "2024-04-10", streaks: 800, amount: "₹8", status: "Completed" },
];

export default function RewardsPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Rewards & Redemption</h1>
        <p className="text-muted-foreground">Convert your hard-earned points into real cash.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Redeem Points</CardTitle>
            <CardDescription>Your points are valuable. Cash them out now!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2">
                 <Star className="w-6 h-6 text-yellow-500" />
                 <span className="text-3xl font-bold">{currentStreaks.toLocaleString()}</span>
              </div>
              <p className="text-muted-foreground">Total Points</p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2">
                 <IndianRupee className="w-6 h-6 text-primary" />
                 <span className="text-3xl font-bold">{currentInrValue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-muted-foreground">Redeemable Value</p>
            </div>
            <Button className="w-full" size="lg">Redeem Now</Button>
            <p className="text-xs text-muted-foreground text-center">
              Note: {POINTS_PER_RUPEE} points = ₹1. Minimum 500 points to redeem.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Redemption History</CardTitle>
            <CardDescription>A record of all your past redemptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptionHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">{item.streaks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.amount}</TableCell>
                    <TableCell className="text-right">
                      <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
