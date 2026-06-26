import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingDown, Landmark, PieChart as PieChartIcon, Pencil, Check, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useSummary, useCategoryStats, useMonthlyStats } from "@/hooks/use-expenses";

const INCOME_KEY = "smart_expense_monthly_income";
const getStoredIncome = () => Number(localStorage.getItem(INCOME_KEY) || "50000");

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useSummary();
  const { data: categories, isLoading: loadingCats } = useCategoryStats();
  const { data: monthly, isLoading: loadingMonthly } = useMonthlyStats();

  const [income, setIncome] = useState(getStoredIncome);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(getStoredIncome()));

  const saveIncome = () => {
    const v = Number(inputVal);
    if (!isNaN(v) && v >= 0) { setIncome(v); localStorage.setItem(INCOME_KEY, String(v)); }
    setEditing(false);
  };

  const totalExpenses = summary?.totalExpenses ?? 0;
  const balance = income - totalExpenses;

  if (loadingSummary || loadingCats || loadingMonthly) {
    return <div className="space-y-6"><h1 className="text-3xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Skeleton className="h-96 rounded-xl" /><Skeleton className="h-96 rounded-xl" /></div>
    </div>;
  }

  const chartData = (categories || []).map(c => ({ name: c.category, value: c.total, color: CATEGORY_COLORS[c.category] || CATEGORY_COLORS["Other"] }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Your financial summary at a glance.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="flex items-center gap-1">
              {editing ? (
                <>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600" onClick={saveIncome}><Check className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => { setInputVal(String(income)); setEditing(false); }}><X className="w-3.5 h-3.5" /></Button>
                </>
              ) : (
                <>
                  <div className="p-1.5 bg-emerald-500/10 rounded-full text-emerald-600"><Landmark className="w-4 h-4" /></div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => { setInputVal(String(income)); setEditing(true); }}><Pencil className="w-3 h-3" /></Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-muted-foreground">₹</span>
                <Input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => { if (e.key==="Enter") saveIncome(); if (e.key==="Escape") { setInputVal(String(income)); setEditing(false); }}} className="h-8 text-lg font-bold" autoFocus />
              </div>
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(income)}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Monthly benchmark — click pencil to edit</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-full text-destructive"><TrendingDown className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all time</p>
          </CardContent>
        </Card>

        <Card className={`shadow-sm ${balance < 0 ? "border-destructive/40" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Balance</CardTitle>
            <div className={`p-2 rounded-full ${balance < 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}><Wallet className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance < 0 ? "text-destructive" : ""}`}>{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground mt-1">{balance < 0 ? "Over budget" : "Available to spend"}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-full text-orange-600"><PieChartIcon className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.monthlyTotal || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Current month expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
          <CardContent className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                    {chartData.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius:"8px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
          <CardContent className="h-[350px]">
            {(monthly && monthly.length > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top:20, right:30, left:20, bottom:5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v),"Expenses"]} contentStyle={{ borderRadius:"8px" }} />
                  <Bar dataKey="total" fill="#3b5bdb" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
