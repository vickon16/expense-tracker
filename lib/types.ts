import * as z from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z
    .string()
    .min(1, "Category is required")
    .max(15, "Category is too long"),
  description: z.string().min(1).max(100, "Description is too long"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than zero")
    .refine((val) => !isNaN(Number(val)), "Must be a number"),
});

export type TTransactionSchema = z.infer<typeof transactionSchema>;

export type TTransaction = Omit<TTransactionSchema, "category"> & {
  id: number;
  createdAt: string;
  categoryId: number;
  category: TCategory;
};

export type TCategory = {
  id: number;
  name: string;
  createdAt: string;
};

export type GroupedExpenditure = {
  type: "income" | "savings" | "expense";
  totalAmount: number;
  percentage: number;
};
