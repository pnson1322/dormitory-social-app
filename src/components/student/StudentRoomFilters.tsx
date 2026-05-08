import { AppSelect } from "@/components/AppSelect";
import { Colors } from "@/constants/colors";
import { BuildingItem, RoomTypeItem } from "@/services/room/room.types";
import { memo, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { StudentRoomFilters } from "@/hooks/student/useStudentRooms";

type Props = {
  filters: StudentRoomFilters;
  buildings: BuildingItem[];
  roomTypes: RoomTypeItem[];
  onChangeFilters: (filters: StudentRoomFilters) => void;
};

export const StudentRoomFiltersView = memo(function StudentRoomFiltersView({
  filters,
  buildings,
  roomTypes,
  onChangeFilters,
}: Props) {
  const FilterChip = ({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      className="h-[36px] items-center justify-center rounded-full px-5"
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
    </Pressable>
  );

  const buildingOptions = useMemo(() => [
    { label: "Tất cả tòa", value: "" },
    ...buildings.map(b => ({ label: b.name, value: b.id }))
  ], [buildings]);

  const typeOptions = useMemo(() => [
    { label: "Tất cả loại", value: "" },
    ...roomTypes.map(rt => ({ label: rt.name, value: rt.id }))
  ], [roomTypes]);

  return (
    <View className="px-5 gap-5 pb-4">
      <View>
        <Text className="mb-2.5 ml-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: Colors.textSecondary }}>
          Trạng thái
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <FilterChip
            label="Tất cả"
            isActive={!filters.status}
            onPress={() => onChangeFilters({ ...filters, status: "" })}
          />
          <FilterChip
            label="Còn trống"
            isActive={filters.status === "AVAILABLE"}
            onPress={() => onChangeFilters({ ...filters, status: "AVAILABLE" })}
          />
          <FilterChip
            label="Đã đầy"
            isActive={filters.status === "FULL"}
            onPress={() => onChangeFilters({ ...filters, status: "FULL" })}
          />
          <FilterChip
            label="Bảo trì"
            isActive={filters.status === "MAINTENANCE"}
            onPress={() => onChangeFilters({ ...filters, status: "MAINTENANCE" })}
          />
        </ScrollView>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppSelect
            label="Tòa nhà"
            value={filters.buildingId}
            options={buildingOptions}
            onSelect={(val) => onChangeFilters({ ...filters, buildingId: val })}
            placeholder="Tất cả tòa"
          />
        </View>
        <View className="flex-1">
          <AppSelect
            label="Loại phòng"
            value={filters.roomTypeId}
            options={typeOptions}
            onSelect={(val) => onChangeFilters({ ...filters, roomTypeId: val })}
            placeholder="Tất cả loại"
          />
        </View>
      </View>
    </View>
  );
});


