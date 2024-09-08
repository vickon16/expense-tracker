import { useQuery } from "@tanstack/react-query";
import {
  categoryTableQuery,
  databaseName,
  transactionTableQuery,
} from "@/constants";
import { GroupedExpenditure, TCategory, TTransaction } from "@/lib/types";
import * as SQLite from "expo-sqlite";
import { useMemo } from "react";

export const useTransactionQuery = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const db = await SQLite.openDatabaseAsync(databaseName);
      // create database if it does not exist
      await db.execAsync(categoryTableQuery);
      await db.execAsync(transactionTableQuery);

      const allRows = await db.getAllAsync(
        `SELECT t.*,
        c.name AS categoryName,
        c.id AS categoryId ,
        c.createdAt AS categoryCreatedAt
        FROM transactions t JOIN category c ON t.categoryId = c.id
        ORDER BY createdAt DESC`
      );

      if (allRows.length === 0) return [];
      const newRows = allRows.map(
        (item: any) =>
          ({
            id: item.id,
            type: item.type,
            amount: item.amount,
            description: item.description,
            createdAt: item.createdAt,
            categoryId: item.categoryId,
            category: {
              id: item.categoryId,
              name: item.categoryName,
              createdAt: item.categoryCreatedAt,
            },
          } satisfies TTransaction)
      );

      return newRows as TTransaction[];
    },
  });
};

export const useCategoryQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const db = await SQLite.openDatabaseAsync(databaseName);
      const allRows = await db.getAllAsync(
        "SELECT * FROM category ORDER BY createdAt DESC"
      );
      return (allRows || []) as TCategory[];
    },
  });
};

export const defaultExpenditure = {
  income: { type: "income", totalAmount: 0, percentage: 0 },
  expense: { type: "expense", totalAmount: 0, percentage: 0 },
  savings: { type: "savings", totalAmount: 0, percentage: 0 },
} as {
  [key in GroupedExpenditure["type"]]: GroupedExpenditure;
};

export const useExpenditureCalculation = () => {
  const query = useTransactionQuery();
  const queryData = query.data || [];

  return useMemo(() => {
    if (!queryData.length)
      return {
        expenseGroup: defaultExpenditure,
        totalAmount: 0,
        isRefetching: query.isRefetching,
        refetch: query.refetch,
      };

    let totalAmount = 0;

    const group = queryData.reduce((acc, current) => {
      if (current.type === "income") {
        acc.income.totalAmount = Number(
          (acc.income.totalAmount + current.amount).toFixed(2)
        );
      } else if (current.type === "expense") {
        acc.expense.totalAmount = Number(
          (acc.expense.totalAmount + current.amount).toFixed(2)
        );
      }

      totalAmount += current.amount;
      return acc;
    }, defaultExpenditure);

    const incomeTotal = group.income.totalAmount;
    const expenseTotal = group.expense.totalAmount;

    return {
      expenseGroup: {
        income: {
          ...group.income,
          totalAmount: Number(incomeTotal.toFixed(2)),
          percentage: Number(((incomeTotal / totalAmount) * 100).toFixed(2)),
        },
        expense: {
          ...group.expense,
          totalAmount: Number(expenseTotal.toFixed(2)),
          percentage: Number(((expenseTotal / totalAmount) * 100).toFixed(2)),
        },
        savings: {
          ...group.savings,
          totalAmount: Number((incomeTotal - expenseTotal).toFixed(2)),
        },
      },
      totalAmount,
      isRefetching: query.isRefetching,
      refetch: query.refetch,
    };
  }, [queryData]);
};
