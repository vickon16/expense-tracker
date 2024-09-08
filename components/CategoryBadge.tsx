import { cn } from "@/lib/utils";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  category: string;
  activeCategory: string;
  onPress: () => void;
};

const CategoryBadge = ({ category, activeCategory, onPress }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Text
        className={cn(
          "px-3 py-1 mr-2 items-center justify-center text-whiteC rounded-md text-xs font-bold border border-grayTintC",
          {
            "bg-secondaryC text-blackC border-none border-0":
              activeCategory === category,
          }
        )}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryBadge;
