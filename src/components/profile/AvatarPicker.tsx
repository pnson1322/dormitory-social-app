import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  imageUri: string | null;
  onPress: () => void;
};

export function AvatarPicker({ imageUri, onPress }: Props) {
  return (
    <View className="items-center">
      <View className="relative">
        <View className="h-[132px] w-[132px] overflow-hidden rounded-full border-[6px] border-slate-950 bg-white">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-slate-200">
              <Ionicons name="person" size={48} color={Colors.textSecondary} />
            </View>
          )}
        </View>

        <Pressable
          onPress={onPress}
          className="absolute bottom-1 right-0 h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: Colors.accent,
            borderWidth: 5,
            borderColor: Colors.textPrimary,
          }}
        >
          <Ionicons name="camera" size={24} color="white" />
        </Pressable>
      </View>

      <Text className="mt-4 text-center text-[16px] font-semibold text-textSecondary">
        Nhấn để thay đổi ảnh đại diện
      </Text>
    </View>
  );
}
