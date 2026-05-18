import { Colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  estimatedTotal: number;
};

export function BookingSummary({ estimatedTotal }: Props) {
  return (
    <View className="mb-8">
      <View
        className="rounded-3xl p-6"
        style={{
          backgroundColor: "#0F172A",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="h-8 w-8 rounded-full bg-white/10 items-center justify-center mr-3">
              <Ionicons name="wallet" size={16} color="white" />
            </View>
            <Text className="text-[15px] font-bold text-slate-300">
              Tạm tính ban đầu
            </Text>
          </View>
        </View>

        <Text className="text-[32px] font-black text-white my-2">
          {formatCurrency(estimatedTotal)}
        </Text>

        <View className="h-[1px] bg-white/10 w-full my-3" />

        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={16} color="#94A3B8" className="mt-0.5" />
          <Text className="text-[13px] text-slate-400 ml-2 flex-1 leading-5">
            Số tiền trên chỉ bao gồm tháng thuê đầu tiên và các khoản phí được
            chọn. Tiền thuê các tháng tiếp theo sẽ được thông báo sau.
          </Text>
        </View>
      </View>
    </View>
  );
}
