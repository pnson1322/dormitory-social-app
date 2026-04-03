import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Option<T extends string> = {
  label: string;
  value: T;
  description?: string;
};

type Props<T extends string> = {
  label: string;
  value: T | null;
  options: Option<T>[];
  placeholder?: string;
  error?: string | null;
  onSelect: (value: T) => void;
};

export function AppSelect<T extends string>({
  label,
  value,
  options,
  placeholder = "Chọn",
  error,
  onSelect,
}: Props<T>) {
  const [visible, setVisible] = useState(false);

  const selectedOption = useMemo(() => {
    return options.find((item) => item.value === value) ?? null;
  }, [options, value]);

  return (
    <View className="gap-2">
      <Text className="text-[13px] font-semibold text-textSecondary">
        {label}
      </Text>

      <Pressable
        onPress={() => setVisible(true)}
        className="h-[52px] flex-row items-center rounded-2xl bg-slate-50 px-4"
        style={{
          borderWidth: 1,
          borderColor: error ? Colors.error : Colors.border,
        }}
      >
        <Text
          className="flex-1 text-[15px]"
          style={{
            color: selectedOption ? Colors.textPrimary : Colors.textSecondary,
          }}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>

        <Ionicons
          name="chevron-down-outline"
          size={20}
          color={Colors.textSecondary}
        />
      </Pressable>

      {!!error && (
        <Text className="text-xs font-semibold text-red-500">{error}</Text>
      )}

      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/35">
          <Pressable className="flex-1" onPress={() => setVisible(false)} />

          <View
            className="rounded-t-[28px] px-5 pb-8 pt-4"
            style={{ backgroundColor: Colors.surface }}
          >
            <View className="items-center">
              <View
                className="h-1.5 w-14 rounded-full"
                style={{ backgroundColor: "#CBD5E1" }}
              />
            </View>

            <Text
              className="mt-5 text-[22px] font-extrabold"
              style={{ color: Colors.textPrimary }}
            >
              {label}
            </Text>

            <ScrollView
              className="mt-5"
              style={{ maxHeight: 360 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-3">
                {options.map((item) => {
                  const selected = item.value === value;

                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => {
                        onSelect(item.value);
                        setVisible(false);
                      }}
                      className="rounded-[20px] px-4 py-4"
                      style={{
                        borderWidth: 1.5,
                        borderColor: selected
                          ? Colors.primaryLight
                          : Colors.border,
                        backgroundColor: selected ? "#EFF6FF" : Colors.surface,
                      }}
                    >
                      <View className="flex-row items-start">
                        <View className="flex-1 pr-3">
                          <Text
                            className="text-[16px] font-semibold"
                            style={{
                              color: selected
                                ? Colors.primary
                                : Colors.textPrimary,
                            }}
                          >
                            {item.label}
                          </Text>

                          {item.description ? (
                            <Text
                              className="mt-1 text-[13px]"
                              style={{ color: Colors.textSecondary }}
                            >
                              {item.description}
                            </Text>
                          ) : null}
                        </View>

                        <Ionicons
                          name={
                            selected
                              ? "radio-button-on"
                              : "radio-button-off-outline"
                          }
                          size={22}
                          color={
                            selected ? Colors.primary : Colors.textSecondary
                          }
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
