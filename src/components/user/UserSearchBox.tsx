import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

function UserSearchBoxBase({ value, onChangeText }: Props) {
  return (
    <View
      className="rounded-[24px]"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View
        className="h-[58px] flex-row items-center rounded-[24px] px-4"
        style={{
          backgroundColor: "#F8FAFC",
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <Ionicons
          name="search-outline"
          size={22}
          color={Colors.textSecondary}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Tìm theo tên hoặc email..."
          placeholderTextColor="#94A3B8"
          className="ml-3 flex-1 text-[16px]"
          style={{ color: Colors.textPrimary }}
        />
      </View>
    </View>
  );
}

export const UserSearchBox = memo(UserSearchBoxBase);
