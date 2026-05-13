import { AppSelect } from "@/components/AppSelect";
import { Colors } from "@/constants/colors";
import { BuildingItem, RoomCountData, RoomStatus, RoomTypeItem } from "@/services/room/room.types";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  counts: RoomCountData;
  status: RoomStatus | "";
  onStatusChange: (status: RoomStatus | "") => void;
  roomTypeId: string;
  onRoomTypeChange: (id: string) => void;
  roomTypes: RoomTypeItem[];
  buildingId: string;
  onBuildingChange: (id: string) => void;
  buildings: BuildingItem[];
  resultText: string;
  filtering: boolean;
};

const FilterChip = ({ label, isActive, onPress, count }: { label: string, isActive: boolean, onPress: () => void, count?: number }) => (
  <Pressable
    onPress={onPress}
    className="h-[38px] items-center justify-center rounded-full px-5 flex-row"
    style={{
      backgroundColor: isActive ? Colors.primary : Colors.surface,
      borderWidth: 1,
      borderColor: isActive ? Colors.primary : Colors.border,
    }}
  >
    <Text
      className="text-[14px] font-bold"
      style={{ color: isActive ? "#FFFFFF" : Colors.textSecondary }}
    >
      {label}
    </Text>
    {count !== undefined && (
      <View 
        className="ml-2 rounded-full px-1.5 py-0.5" 
        style={{ backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#F1F5F9" }}
      >
        <Text className="text-[10px] font-bold" style={{ color: isActive ? "#FFFFFF" : Colors.textSecondary }}>
          {count}
        </Text>
      </View>
    )}
  </Pressable>
);

export function RoomListFilters({ 
  counts, 
  status, 
  onStatusChange, 
  roomTypeId,
  onRoomTypeChange,
  roomTypes,
  buildingId,
  onBuildingChange,
  buildings,
  resultText, 
  filtering 
}: Props) {
  const buildingOptions = useMemo(() => [
    { label: "Tất cả tòa", value: "" },
    ...buildings.map(b => ({ label: b.name, value: b.id }))
  ], [buildings]);

  const typeOptions = useMemo(() => [
    { label: "Tất cả loại", value: "" },
    ...roomTypes.map(rt => ({ label: rt.name, value: rt.id }))
  ], [roomTypes]);

  return (
    <View className="px-5 pt-5 gap-5 mb-2">
      <View>
        <Text className="mb-3 ml-1 text-[12px] font-bold uppercase tracking-widest" style={{ color: Colors.textSecondary }}>
          Trạng thái phòng
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <FilterChip
            label="Tất cả"
            count={counts.Total}
            isActive={status === ""}
            onPress={() => onStatusChange("")}
          />
          <FilterChip
            label="Còn trống"
            count={counts.AVAILABLE}
            isActive={status === "AVAILABLE"}
            onPress={() => onStatusChange("AVAILABLE")}
          />
          <FilterChip
            label="Đã đầy"
            count={counts.FULL}
            isActive={status === "FULL"}
            onPress={() => onStatusChange("FULL")}
          />
          <FilterChip
            label="Bảo trì"
            count={counts.MAINTENANCE}
            isActive={status === "MAINTENANCE"}
            onPress={() => onStatusChange("MAINTENANCE")}
          />
        </ScrollView>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppSelect
            label="Tòa nhà"
            value={buildingId}
            options={buildingOptions}
            onSelect={onBuildingChange}
            placeholder="Tất cả tòa"
          />
        </View>
        <View className="flex-1">
          <AppSelect
            label="Loại phòng"
            value={roomTypeId}
            options={typeOptions}
            onSelect={onRoomTypeChange}
            placeholder="Tất cả loại"
          />
        </View>
      </View>

      <View className="flex-row items-center mb-1">
        <Text
          className="flex-1 text-[16px] font-bold"
          style={{ color: Colors.textPrimary }}
        >
          {resultText}
        </Text>

        {filtering ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : null}
      </View>
    </View>
  );
}
