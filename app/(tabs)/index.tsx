import CategorySection from "@/components/CategorySection";
import ExpenditureSection from "@/components/ExpenditureSection";
import HomeHeader from "@/components/HomeHeader";
import Transactions from "@/components/Transactions";
import { colors } from "@/constants/colors";
import { useExpenditureCalculation } from "@/lib/queries";
import { Stack } from "expo-router";
import millify from "millify";
import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Home = () => {
  const { expenseGroup, totalAmount, isRefetching, refetch } =
    useExpenditureCalculation();

  console.log(expenseGroup);

  const pieData = [
    {
      value: expenseGroup["income"].totalAmount,
      color: colors.incomeC,
      text: expenseGroup["income"].percentage.toString() + "%",
    },
    {
      value: expenseGroup["expense"].totalAmount,
      color: colors.secondaryC,
      text: expenseGroup["expense"].percentage.toString() + "%",
    },
  ];

  return (
    <>
      <Stack.Screen options={{ header: () => <HomeHeader /> }} />
      <View className="flex-1 h-full bg-blackC px-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-24 mb-8"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <View className="flex-row justify-between items-center">
            {/* Expenses */}
            <View className="gap-1">
              <Text className="text-whiteC text-lg">
                My <Text className="font-bold">Expenses</Text>
              </Text>
              <Text className="text-incomeC text-3xl font-bold">
                ${millify(Number(totalAmount))}
              </Text>
            </View>

            {/* Chart */}
            <View className="items-center ">
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                focusOnPress
                semiCircle
                radius={75}
                innerRadius={55}
                innerCircleColor={colors.blackC}
                centerLabelComponent={() => {
                  return (
                    <View className="items-center justify-center">
                      <Text className="text-whiteC font-bold text-lg">$$</Text>
                    </View>
                  );
                }}
                isAnimated={true}
                animationDuration={2000}
              />
            </View>
          </View>

          <ExpenditureSection />
          <CategorySection />
          <Transactions />
        </ScrollView>
      </View>
    </>
  );
};

export default Home;
