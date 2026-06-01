import { Colors } from "@/constants/colors";
import { useBookingTerms } from "@/hooks/student/useBookingTerms";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";

type Props = {
  agreed: boolean;
  onAgreedChange: (val: boolean) => void;
  roomTypeId?: string;
};

export function BookingTerms({ agreed, onAgreedChange, roomTypeId }: Props) {
  const { terms, loading } = useBookingTerms(roomTypeId);

  return (
    <View className="mb-8">
      <Text className="text-[16px] font-bold text-slate-900 mb-4">
        Điều khoản & Nội quy
      </Text>

      <View
        className="rounded-3xl p-5 bg-white mb-4"
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          shadowColor: "#94A3B8",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center mb-4">
          <Ionicons name="document-text" size={20} color={Colors.primary} />
          <Text className="text-[15px] font-bold text-slate-800 ml-2">
            Cam kết khi đăng ký
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} className="my-4" />
        ) : (
          <View className="gap-y-3">
            {terms.map((term, index) => (
              <View key={term.id} className="flex-row items-start">
                <Text className="text-[13px] font-bold text-slate-400 mr-2 mt-0.5 w-7">
                  {index + 1}.
                </Text>
                <Text className="text-[14px] leading-5 text-slate-600 flex-1">
                  {term.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={() => onAgreedChange(!agreed)}
        className="flex-row items-center gap-3 p-1"
      >
        <Switch
          value={agreed}
          onValueChange={onAgreedChange}
          trackColor={{ false: "#CBD5E1", true: Colors.primaryLight }}
          thumbColor={agreed ? Colors.primary : "#F8FAFC"}
        />
        <Text className="flex-1 text-[14px] font-medium text-slate-700 leading-5">
          Tôi đã đọc và đồng ý với các điều khoản, nội quy đăng ký cư trú tại ký
          túc xá.
        </Text>
      </Pressable>
    </View>
  );
}
