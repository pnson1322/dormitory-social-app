import { Colors } from "@/constants/colors";
import { FeeTemplate } from "@/services/booking/booking.types";
import { formatCurrency } from "@/utils/room";
import { Pressable, Switch, Text, View } from "react-native";

type Props = {
  basePrice: number;
  mandatoryFees: FeeTemplate[];
  optionalFees: FeeTemplate[];
  selectedOptionalFees: string[];
  onToggleOptionalFee: (feeCode: string) => void;
};

export function BookingFeeList({
  basePrice,
  mandatoryFees,
  optionalFees,
  selectedOptionalFees,
  onToggleOptionalFee,
}: Props) {
  return (
    <>
      <View className="mb-6">
        <Text className="text-[16px] font-bold text-slate-900 mb-4">
          Phí bắt buộc
        </Text>
        <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <View className="p-4 border-b border-slate-100 flex-row justify-between items-center bg-slate-50/50">
            <Text className="text-[14px] font-medium text-slate-700">
              Tiền phòng (1 tháng)
            </Text>
            <Text className="text-[15px] font-bold text-slate-900">
              {formatCurrency(basePrice)}
            </Text>
          </View>
          {mandatoryFees.map((fee, idx) => (
            <View
              key={fee.id}
              className={`p-4 flex-row justify-between items-center ${
                idx < mandatoryFees.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <View className="flex-1 mr-4">
                <Text className="text-[14px] font-medium text-slate-700 mb-1">
                  {fee.feeName}
                </Text>
                {fee.description ? (
                  <Text className="text-[12px] text-slate-500">
                    {fee.description}
                  </Text>
                ) : null}
              </View>
              <Text className="text-[15px] font-bold text-slate-900">
                {formatCurrency(fee.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {optionalFees.length > 0 && (
        <View className="mb-8">
          <Text className="text-[16px] font-bold text-slate-900 mb-4">
            Dịch vụ tùy chọn
          </Text>
          <View className="gap-3">
            {optionalFees.map((fee) => {
              const isSelected = selectedOptionalFees.includes(fee.feeCode);
              return (
                <Pressable
                  key={fee.id}
                  onPress={() => onToggleOptionalFee(fee.feeCode)}
                  className={`p-4 rounded-2xl flex-row items-center border ${
                    isSelected
                      ? "border-primary bg-blue-50/50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-1 mr-4">
                    <Text
                      className={`text-[15px] font-bold mb-1 ${
                        isSelected ? "text-primary" : "text-slate-900"
                      }`}
                    >
                      {fee.feeName}
                    </Text>
                    <Text className="text-[13px] text-slate-500 mb-2">
                      {formatCurrency(fee.amount)} / kỳ
                    </Text>
                    {fee.description ? (
                      <Text className="text-[12px] text-slate-400 leading-4">
                        {fee.description}
                      </Text>
                    ) : null}
                  </View>
                  <Switch
                    value={isSelected}
                    onValueChange={() => onToggleOptionalFee(fee.feeCode)}
                    trackColor={{ false: "#CBD5E1", true: Colors.primaryLight }}
                    thumbColor={isSelected ? Colors.primary : "#F8FAFC"}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </>
  );
}
