import { View, Text } from "react-native";
import React from "react";

type Props = {
  title: string;
  description?: string;
  refresh?: () => void;
};

const NoData = ({ title, description, refresh }: Props) => {
  return (
    <View className="flex-1 items-center justify-center my-4 ">
      <Text className="text-whiteC text-sm">{title}</Text>
      {description && (
        <Text className="text-grayTintC text-xs">{description}</Text>
      )}
      {refresh && (
        <Text className="text-secondaryC text-xs mt-1" onPress={refresh}>
          Refresh
        </Text>
      )}
    </View>
  );
};

export default NoData;
