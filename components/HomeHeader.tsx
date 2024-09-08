import profileImg from "@/assets/images/profile-image.jpg";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeHeader = () => {
  return (
    <SafeAreaView className="bg-blackC h-full flex-1 pt-4">
      <View className="flex-row justify-between h-[70px] items-center px-3">
        <View className="flex-row items-center">
          <Image
            source={profileImg}
            resizeMode="cover"
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-2">
            <Text className="text-whiteC text-sm">Hi, Victor</Text>
            <Text className="text-whiteC text-base">Welcome Back</Text>
          </View>
        </View>
        <View>
          <Text className="text-incomeC font-bold text-lg leading-6">
            Expense
          </Text>
          <Text className="text-incomeC font-bold text-lg leading-6">
            Tracker
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeHeader;
