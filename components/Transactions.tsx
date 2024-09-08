import { colors } from "@/constants/colors";
import { useTransactionQuery } from "@/lib/queries";
import { cn, formatDateWithDateFns } from "@/lib/utils";
import { FontAwesome } from "@expo/vector-icons";
import millify from "millify";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import NoData from "./NoData";

const Transactions = () => {
  const query = useTransactionQuery();

  return (
    <View className="mt-6 space-y-3">
      <Text className="text-whiteC text-sm">All Transactions</Text>
      {query.isLoading || query.isRefetching || query.isError ? (
        <View className="flex-row items-center justify-center py-10">
          <ActivityIndicator size={25} color={colors.secondaryC} />
        </View>
      ) : !query.data?.length ? (
        <NoData
          title="No transaction found"
          description="Create a new transaction"
          refresh={query.refetch}
        />
      ) : (
        query.data.map((item) => {
          return (
            <View
              key={item.id}
              className={cn("flex-row gap-x-3 py-4 border-b justify-between ", {
                "border-b-incomeC/20": item.type === "income",
                "border-b-expenseC/20": item.type === "expense",
              })}
            >
              {item.type === "income" ? (
                <FontAwesome name="dollar" size={24} color={colors.incomeC} />
              ) : (
                <FontAwesome name="minus" size={24} color={colors.expenseC} />
              )}

              <View className="flex-1 space-y-1 items-start">
                <Text
                  className=" text-white text-xs capitalize border px-2 py-0.5 border-grayTintC rounded-md"
                  numberOfLines={1}
                >
                  {item.category.name}
                </Text>
                <Text
                  className=" text-whiteC text-sm max-w-[250px] capitalize"
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
                <Text className=" text-grayTintC text-xs" numberOfLines={1}>
                  {formatDateWithDateFns(item.createdAt)}
                </Text>
              </View>

              <Text
                className={cn("text-lg font-bold", {
                  "text-expenseC": item.type === "expense",
                  "text-incomeC": item.type === "income",
                })}
              >
                ${millify(Number(item.amount))}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};

export default Transactions;
