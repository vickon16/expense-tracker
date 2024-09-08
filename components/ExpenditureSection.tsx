import { colors } from "@/constants/colors";
import { useExpenditureCalculation } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import millify from "millify";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const ExpenditureSection = () => {
  const { expenseGroup } = useExpenditureCalculation();

  return (
    <View className="mt-6 flex-row">
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/create")}
        className="flex mr-3 border-2 border-grayTintC/50 border-dashed border-spacing-4 rounded-lg p-2 justify-center items-center"
      >
        <Feather name="plus" size={22} color={colors.grayTintC} />
      </TouchableOpacity>

      <FlatList
        keyExtractor={(item) => item}
        data={Object.keys(expenseGroup)}
        renderItem={({ item }) => {
          const data = expenseGroup[item as keyof typeof expenseGroup];

          return (
            <View
              className={cn(
                "w-[150px] items-start p-2 mr-3 space-y-2 rounded-lg",
                {
                  "bg-savingsC/80": data.type === "savings",
                  "bg-expenseC/80": data.type === "expense",
                  "bg-incomeC/80": data.type === "income",
                }
              )}
            >
              <Text className=" text-white text-xs font-bold">
                {data.type === "savings"
                  ? "Savings"
                  : data.type === "expense"
                  ? "Expense"
                  : "Income"}
              </Text>

              <Text
                className={cn(
                  "text-lg font-bold text-whiteC px-2 py-1 ml-1 rounded-md bg-grayOpacity"
                )}
              >
                ${millify(Number(data.totalAmount))}
              </Text>

              {data.type !== "savings" && (
                <Text className="text-whiteC text-sm font-bold">
                  {data.percentage}%
                </Text>
              )}
            </View>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ExpenditureSection;
