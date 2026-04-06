import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export default function SettingsPage() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: Colors.background }}
    >
      <Text style={{ color: Colors.textPrimary }}>Màn Cài đặt</Text>
    </View>
  );
}
