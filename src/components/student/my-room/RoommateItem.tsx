import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { memo } from "react";

type Props = {
  name: string;
  studentId: string;
  avatar: string;
};

export const RoommateItem = memo(function RoommateItem({ name, studentId, avatar }: Props) {
  return (
    <View className="flex-row items-center">
      <Image 
        source={{ uri: avatar }} 
        className="h-10 w-10 rounded-full bg-slate-200"
      />
      <View className="ml-3 flex-1">
        <Text className="text-slate-900 font-bold text-[14px]">{name}</Text>
        <Text className="text-slate-400 text-[12px]">{studentId}</Text>
      </View>
      <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
    </View>
  );
});
