import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, ReceiptText } from "lucide-react";
import { format } from "date-fns";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useExpenses, useDeleteExpense } from "@/hooks/use-expenses";

export default function Expenses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const deleteExpense = useDeleteExpense();
  const { data: expenses, isLoading } = useExpenses({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    sortBy: "date", order: "desc",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground mt-1">Manage and track your transaction history.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." className="pl-9 bg-card" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">{[1,2,3,4,5].map(i => <Skeleton key={i} className="w-full h-12" />)}</div>
        ) : !expenses?.length ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <ReceiptText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No expenses found</h3>
            <p className="text-muted-foreground">
              {search || category !== "all" ? "Try adjusting your search or filters." : "Add your first expense to get started!"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground">{format(new Date(e.date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-medium">
                    {e.title}
                    {e.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{e.notes}</p>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal" style={{ borderColor: CATEGORY_COLORS[e.category], color: CATEGORY_COLORS[e.category] }}>
                      {e.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(e.amount)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteExpense.mutate(e.id)} disabled={deleteExpense.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
