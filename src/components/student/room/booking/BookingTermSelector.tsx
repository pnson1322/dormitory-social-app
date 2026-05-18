import { TermOption } from "@/utils/term";
import { Pressable, Text, View } from "react-native";

type Props = {
  terms: TermOption[];
  selectedTerm: string;
};

export function BookingTermSelector({ terms, selectedTerm }: Props) {
  const term = terms.find(t => t.id === selectedTerm) || terms[0];
  
  if (!term) return null;

  return (
    <View className="mb-8">
      <Text className="text-[16px] font-bold text-slate-900 mb-4">
        Học kỳ đăng ký
      </Text>
      <View className="p-4 rounded-2xl flex-row items-center border border-primary bg-blue-50/50">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
          <Text className="text-[18px]">🎓</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-primary">
            {term.label}
          </Text>
          <Text className="text-[13px] text-slate-500 mt-0.5">
            (Đợt đăng ký tiếp theo)
          </Text>
        </View>
      </View>
    </View>
  );
}
