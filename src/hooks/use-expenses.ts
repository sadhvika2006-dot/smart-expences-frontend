import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/utils";

export interface Expense {
  id: string; title: string; amount: number; category: string;
  notes: string | null; date: string; createdAt: string;
}
export interface Summary {
  totalExpenses: number; totalIncome: number; balance: number;
  monthlyTotal: number; count: number;
}
export interface CategoryStat { category: string; total: number; count: number; }
export interface MonthlyStat { month: string; total: number; }

export interface ListParams {
  search?: string; category?: string; sortBy?: string; order?: string;
}

function buildQuery(params: ListParams) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.category) q.set("category", params.category);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.order) q.set("order", params.order);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function useExpenses(params: ListParams = {}) {
  return useQuery<Expense[]>({
    queryKey: ["expenses", params],
    queryFn: () => apiFetch(`/expenses${buildQuery(params)}`),
  });
}

export function useSummary() {
  return useQuery<Summary>({ queryKey: ["summary"], queryFn: () => apiFetch("/expenses/summary") });
}

export function useCategoryStats() {
  return useQuery<CategoryStat[]>({ queryKey: ["by-category"], queryFn: () => apiFetch("/expenses/by-category") });
}

export function useMonthlyStats() {
  return useQuery<MonthlyStat[]>({ queryKey: ["monthly"], queryFn: () => apiFetch("/expenses/monthly") });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Expense, "id"|"createdAt">) =>
      apiFetch<Expense>("/expenses", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["by-category"] });
      qc.invalidateQueries({ queryKey: ["monthly"] });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/expenses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["by-category"] });
      qc.invalidateQueries({ queryKey: ["monthly"] });
    },
  });
}
