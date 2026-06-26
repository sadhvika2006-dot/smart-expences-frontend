import { Link, useLocation } from "wouter";
import { LayoutDashboard, Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ExpenseForm } from "./expense-form";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Expenses", href: "/expenses", icon: Receipt },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Receipt className="w-5 h-5" />
            </div>
            Smart Expense
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map(item => {
            const active = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                  <item.icon className="w-5 h-5" />{item.name}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button onClick={() => setFormOpen(true)} className="w-full gap-2 font-semibold">
            <Plus className="w-4 h-4" />Add Expense
          </Button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
      <ExpenseForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
