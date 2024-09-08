import { colors } from "@/constants/colors";
import { useTransactionQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { FontAwesome } from "@expo/vector-icons";
import millify from "millify";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import CategoryBadge from "./CategoryBadge";
import NoData from "./NoData";

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const query = useTransactionQuery();

  const categories = useMemo(() => {
    if (!query.data) return [];

    const newCategories = query.data.reduce((acc, current) => {
      if (acc.includes(current.category.name)) return acc;
      return [...acc, current.category.name];
    }, [] as string[]);

    setActiveCategory(newCategories[0]);
    return newCategories;
  }, [query.data]);

  const transactionsData = useMemo(() => {
    if (!query.data) return [];

    return query.data.filter((item) => item.category.name === activeCategory);
  }, [activeCategory]);

  return (
    <View className="mt-6 ">
      <Text className="text-whiteC text-sm">Filter by Category</Text>
      {query.isLoading || query.isRefetching || query.isError ? (
        <View className="flex-row items-center justify-center mt-4 mb-3">
          <ActivityIndicator size={25} color={colors.secondaryC} />
        </View>
      ) : !categories.length || !transactionsData.length ? (
        <NoData
          title="No category found"
          description="Create a new transaction"
          refresh={query.refetch}
        />
      ) : (
        <>
          <View className="mt-2">
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <CategoryBadge
                  category={item}
                  activeCategory={activeCategory}
                  onPress={() => setActiveCategory(item)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View className="mt-4 ml-2">
            <FlatList
              data={transactionsData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="bg-grayC rounded-xl p-3 space-y-2 w-[150px] mr-3">
                  <View className="flex-row items-center justify-between">
                    {item.type === "income" ? (
                      <>
                        <FontAwesome
                          name="dollar"
                          size={16}
                          color={colors.incomeC}
                        />
                        <Text className="ml-2 text-grayTintC font-bold text-sm">
                          Income
                        </Text>
                      </>
                    ) : (
                      <>
                        <FontAwesome
                          name="minus"
                          size={16}
                          color={colors.expenseC}
                        />
                        <Text className="ml-2 text-grayTintC font-bold text-sm">
                          Expense
                        </Text>
                      </>
                    )}
                  </View>
                  <Text className="text-grayTintC text-sm" numberOfLines={2}>
                    {item.description}
                  </Text>

                  <Text
                    className={cn("text-lg font-bold", {
                      "text-expenseC": item.type === "expense",
                      "text-incomeC": item.type === "income",
                    })}
                  >
                    ${millify(Number(item.amount))}
                  </Text>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default CategorySection;
