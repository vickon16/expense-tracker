import CategoryBadge from "@/components/CategoryBadge";
import { databaseName } from "@/constants";
import { colors } from "@/constants/colors";
import { useCategoryQuery } from "@/lib/queries";
import { TCategory, transactionSchema, TTransactionSchema } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SQLite from "expo-sqlite";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultValues = {
  type: "income" as const,
  amount: 0,
  category: "",
  description: "",
};

const Create = () => {
  const categoryQuery = useCategoryQuery();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TTransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });
  const [isOpenNewCategory, setIsOpenNewCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(() => {
    if (!categoryQuery.data?.length) return [];

    const newCategories = categoryQuery.data.reduce((acc, current) => {
      if (acc.includes(current.name)) return acc;
      return [...acc, current.name];
    }, [] as string[]);

    setValue("category", newCategories[0]);
    return newCategories;
  }, [categoryQuery.data]);

  const onSubmit = async (data: TTransactionSchema) => {
    setIsSubmitting(true);
    try {
      const db = await SQLite.openDatabaseAsync(databaseName);

      // check if the category exists
      const firstRow: TCategory | null = await db.getFirstAsync(
        "SELECT * FROM category WHERE name = ?",
        data.category
      );

      const insertTransactionQuery = `
        INSERT INTO transactions (type, categoryId, description, amount)
        VALUES (?, ?, ?, ?)
      `;

      if (!firstRow) {
        db.withExclusiveTransactionAsync(async (task) => {
          // create the category table
          const category = await task.runAsync(
            `INSERT INTO category (name)
            VALUES (?) `,
            data.category
          );

          await task.runAsync(
            insertTransactionQuery,
            data.type,
            category.lastInsertRowId,
            data.description,
            data.amount
          );
        });
      } else {
        await db.runAsync(
          insertTransactionQuery,
          data.type,
          firstRow.id,
          data.description,
          data.amount
        );
      }

      await db.closeAsync();

      reset(defaultValues);
      setIsOpenNewCategory(false);
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      Alert.alert("Successfully created transaction");
      router.replace("/(tabs)/");
    } catch (error: any) {
      console.log(error?.message || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-blackC h-full flex-1 pt-4 px-4 space-y-1">
      <Text className="text-xl font-bold text-whiteC">Create Transaction</Text>

      <ScrollView
        className="gap-y-8 h-full flex-grow"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-x-2 mt-8">
          <TouchableOpacity onPress={() => setValue("type", "income")}>
            <Text
              className={cn(
                "text-base bg-grayC text-white px-3 py-1 rounded-lg",
                {
                  "bg-incomeC font-bold": watch("type") === "income",
                }
              )}
            >
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setValue("type", "expense")}>
            <Text
              className={cn(
                "text-base bg-grayC text-white px-3 py-1  rounded-lg",
                {
                  "bg-expenseC font-bold": watch("type") === "expense",
                }
              )}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-x-3 items-start">
          <TouchableOpacity
            className="border border-grayTintC items-center justify-center p-1"
            onPress={() =>
              setIsOpenNewCategory((prev) => {
                if (prev) {
                  setValue("category", categories[0] || "");
                  return false;
                }
                setValue("category", "");
                return true;
              })
            }
          >
            <Feather name="plus" size={15} color={colors.grayTintC} />
          </TouchableOpacity>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryBadge
                category={item}
                activeCategory={watch("category")}
                onPress={() => setValue("category", item)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {!!isOpenNewCategory && (
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="gap-y-2 mt-2">
                <Text className="text-md font-semibold text-whiteC">
                  Category
                </Text>
                <TextInput
                  className="h-[50px] border border-grayC px-3 rounded-lg text-white text-md"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter New Category"
                  placeholderTextColor="#777"
                />
                {errors.description && (
                  <Text className="text-red-500">
                    {errors.description.message}
                  </Text>
                )}
              </View>
            )}
          />
        )}

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="gap-y-2 mt-6">
              <Text className="text-md font-semibold text-whiteC">Amount</Text>
              <TextInput
                className="h-[50px] text-white text-2xl rounded-lg"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? value.toString() : ""}
                placeholder="$ Enter amount"
                keyboardType="numeric"
                placeholderTextColor="#777"
              />
              {errors.amount && (
                <Text className="text-red-500">{errors.amount.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="gap-y-2 mt-2">
              <Text className="text-md font-semibold text-whiteC">
                Description
              </Text>
              <TextInput
                className="h-[60px] border border-grayC px-3 rounded-lg text-white text-md"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter description"
                placeholderTextColor="#777"
                multiline
              />
              {errors.description && (
                <Text className="text-red-500">
                  {errors.description.message}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-secondaryC w-full h-[50px] rounded-xl items-center justify-center"
          disabled={isSubmitting}
        >
          <Text className="text-lg font-bold">
            {isSubmitting ? "Creating..." : "Create Transaction"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
