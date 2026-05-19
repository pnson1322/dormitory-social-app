import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { IncidentCategoryResponse } from "@/services/incident/incident.types";
import { getCategoryStyle } from "@/utils/incident";

interface Props {
  categories: IncidentCategoryResponse[];
  isLoading: boolean;
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export function IncidentCategorySelector({ categories, isLoading, selectedCategory, onSelect }: Props) {
  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="text-[16px] font-bold text-slate-900 mb-3">Loại sự cố</Text>
        <View className="flex-row justify-center py-6">
          <ActivityIndicator color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (categories.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="text-[16px] font-bold text-slate-900 mb-3">Loại sự cố</Text>
      <View className="flex-row flex-wrap justify-start gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const style = getCategoryStyle(cat.name);
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.7}
              style={{
                backgroundColor: isSelected ? style.color : Colors.surface,
                borderColor: isSelected ? style.color : Colors.border,
                borderWidth: 1,
                shadowColor: isSelected ? style.color : "#000",
                shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                shadowOpacity: isSelected ? 0.3 : 0.05,
                shadowRadius: isSelected ? 8 : 4,
                elevation: isSelected ? 5 : 1,
                width: "30%", // Ensures 3 columns per row
              }}
              className="py-4 rounded-2xl items-center justify-center overflow-hidden mb-2"
            >
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${style.color}15` }}
              >
                <Ionicons
                  name={style.icon}
                  size={24}
                  color={isSelected ? "#FFF" : style.color}
                />
              </View>
              <Text
                style={{ color: isSelected ? "#FFF" : "#475569" }}
                className={`text-[13px] ${isSelected ? "font-bold" : "font-semibold"} text-center px-1`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
