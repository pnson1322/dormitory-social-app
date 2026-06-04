import { TermOption } from "@/utils/term";
import { Pressable, Text, View } from "react-native";

type Props = {
  terms: TermOption[];
  selectedTerm: string;
  onSelectTerm?: (termId: string) => void;
};

export function BookingTermSelector({ terms, selectedTerm, onSelectTerm }: Props) {
  if (!terms || terms.length === 0) return null;

  return (
    <View className="mb-8">
      <Text className="text-[16px] font-bold text-slate-900 mb-4">
        Học kỳ đăng ký
      </Text>
      <View className="gap-3">
        {terms.map((term, index) => {
          const isSelected = term.id === selectedTerm;
          return (
            <Pressable
              key={term.id}
              onPress={() => onSelectTerm?.(term.id)}
              disabled={!onSelectTerm}
              className={`p-4 rounded-2xl flex-row items-center border ${
                isSelected
                  ? "border-primary bg-blue-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Text className="text-[18px]">🎓</Text>
              </View>
              <View className="flex-1">
                <Text
                  className={`text-[15px] font-bold ${
                    isSelected ? "text-primary" : "text-slate-900"
                  }`}
                >
                  {term.label}
                </Text>
                <Text className="text-[12px] text-slate-500 mt-0.5">
                  {index === 0 ? "(Học kỳ hiện tại)" : "(Học kỳ tiếp theo)"}
                </Text>
              </View>
              {onSelectTerm && (
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${
                    isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

