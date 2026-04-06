import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export default function PermissionsPage() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: Colors.background }}
    >
      <Text style={{ color: Colors.textPrimary }}>Màn Phân quyền</Text>
    </View>
  );
}
