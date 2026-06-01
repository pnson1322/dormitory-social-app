import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View, Pressable } from "react-native";
import { memo } from "react";

type Props = {
  name: string;
  studentId: string;
  avatarUrl: string | null;
  isCurrentUser?: boolean;
  onChatPress?: () => void;
};

export const RoommateItem = memo(function RoommateItem({ 
  name, 
  studentId, 
  avatarUrl, 
  isCurrentUser = false,
  onChatPress 
}: Props) {
  const displayAvatar = avatarUrl 
    ? { uri: avatarUrl } 
    : { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random` };

  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center flex-1">
        <Image 
          source={displayAvatar} 
          className="h-10 w-10 rounded-full bg-slate-200"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-slate-900 font-bold text-[14px]">{name}</Text>
            {isCurrentUser && (
              <View className="ml-2 px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded-md">
                <Text className="text-[10px] text-blue-600 font-bold">Tôi</Text>
              </View>
            )}
          </View>
          <Text className="text-slate-400 text-[12px]">{studentId}</Text>
        </View>
      </View>
      {!isCurrentUser && onChatPress && (
        <Pressable 
          onPress={onChatPress} 
          className="h-9 w-9 rounded-full bg-blue-50 items-center justify-center active:bg-blue-100"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary} />
        </Pressable>
      )}
    </View>
  );
});
