import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { AppSelect } from "@/components/AppSelect";
import { FormSection } from "@/components/profile/FormSection";
import { Colors } from "@/constants/colors";
import { BuildingItem, RoomTypeItem } from "@/services/room.api";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  form: {
    buildingId: string;
    name: string;
    floor: string;
    roomTypeId: string;
    loading: boolean;
    buildingErr: string | null;
    nameErr: string | null;
    floorErr: string | null;
    roomTypeErr: string | null;
    isFormValid: boolean;
    setBuildingId: (value: string) => void;
    setName: (value: string) => void;
    setFloor: (value: string) => void;
    setRoomTypeId: (value: string) => void;
    setTouched: React.Dispatch<
      React.SetStateAction<{
        buildingId: boolean;
        name: boolean;
        floor: boolean;
        roomTypeId: boolean;
      }>
    >;
  };
  buildings: BuildingItem[];
  roomTypes: RoomTypeItem[];
  onSubmit: () => void;
  onCancel: () => void;
};

export function RoomForm({
  form,
  buildings,
  roomTypes,
  onSubmit,
  onCancel,
}: Props) {
  const selectedBuilding =
    buildings.find((item) => item.id === form.buildingId) ?? null;

  const selectedRoomType =
    roomTypes.find((item) => item.id === form.roomTypeId) ?? null;

  const previewTitle = form.name.trim() || "Tên phòng sẽ hiển thị ở đây";

  return (
    <View className="gap-6">
      <FormSection title="Thông tin cơ bản">
        <AppSelect
          label="Tòa"
          value={form.buildingId || null}
          options={buildings.map((item) => ({
            label: `${item.name} (${item.code})`,
            value: item.id,
            description: `${item.zoneName} • ${item.totalFloors} tầng`,
          }))}
          placeholder="Chọn tòa"
          error={form.buildingErr}
          onSelect={(value) => {
            form.setBuildingId(value);
            form.setTouched((prev) => ({ ...prev, buildingId: true }));
          }}
        />

        <AppInput
          label="Tên phòng"
          value={form.name}
          onChangeText={form.setName}
          placeholder="Ví dụ: A101"
          error={form.nameErr}
          onBlur={() => form.setTouched((prev) => ({ ...prev, name: true }))}
        />

        <AppInput
          label="Tầng"
          value={form.floor}
          onChangeText={form.setFloor}
          placeholder="Ví dụ: 1"
          keyboardType="number-pad"
          error={form.floorErr}
          onBlur={() => form.setTouched((prev) => ({ ...prev, floor: true }))}
        />

        <AppSelect
          label="Loại phòng"
          value={form.roomTypeId || null}
          options={roomTypes.map((item) => ({
            label: item.name,
            value: item.id,
            description: `${item.capacity} người • ${formatCurrency(item.basePrice)}`,
          }))}
          placeholder="Chọn loại phòng"
          error={form.roomTypeErr}
          onSelect={(value) => {
            form.setRoomTypeId(value);
            form.setTouched((prev) => ({ ...prev, roomTypeId: true }));
          }}
        />
      </FormSection>

      <FormSection title="Xem trước">
        <View
          className="rounded-[22px] p-4"
          style={{
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text
                className="text-[20px] font-extrabold"
                style={{ color: Colors.textPrimary }}
              >
                {previewTitle}
              </Text>

              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="business-outline"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text
                  className="ml-2 text-[14px]"
                  style={{ color: Colors.textSecondary }}
                >
                  {selectedBuilding
                    ? `${selectedBuilding.name} • Tầng ${form.floor || "--"}`
                    : `Chưa chọn tòa • Tầng ${form.floor || "--"}`}
                </Text>
              </View>
            </View>

            <View
              className="rounded-full px-3 py-2"
              style={{ backgroundColor: "#DCFCE7" }}
            >
              <Text
                className="text-[12px] font-bold"
                style={{ color: "#10B981" }}
              >
                CÒN TRỐNG
              </Text>
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <View
              className="flex-1 rounded-[18px] px-4 py-4"
              style={{ backgroundColor: Colors.surface }}
            >
              <Text
                className="text-[13px] font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Sức chứa
              </Text>
              <Text
                className="mt-2 text-[18px] font-extrabold"
                style={{ color: Colors.textPrimary }}
              >
                {selectedRoomType ? `${selectedRoomType.capacity} người` : "--"}
              </Text>
            </View>

            <View
              className="flex-1 rounded-[18px] px-4 py-4"
              style={{ backgroundColor: Colors.surface }}
            >
              <Text
                className="text-[13px] font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Giá cơ bản
              </Text>
              <Text
                className="mt-2 text-[18px] font-extrabold"
                style={{ color: Colors.textPrimary }}
              >
                {selectedRoomType
                  ? formatCurrency(selectedRoomType.basePrice)
                  : "--"}
              </Text>
            </View>
          </View>
        </View>
      </FormSection>

      {selectedRoomType ? (
        <FormSection title="Thông tin loại phòng">
          <View className="gap-4">
            <View>
              <Text
                className="text-[13px] font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Tên loại phòng
              </Text>
              <Text
                className="mt-1 text-[16px] font-bold"
                style={{ color: Colors.textPrimary }}
              >
                {selectedRoomType.name}
              </Text>
            </View>

            <View>
              <Text
                className="text-[13px] font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Tiện ích
              </Text>

              <View className="mt-3 flex-row flex-wrap gap-2">
                {selectedRoomType.amenities?.length ? (
                  selectedRoomType.amenities.map((amenity, index) => (
                    <View
                      key={`${amenity}-${index}`}
                      className="rounded-full px-3 py-2"
                      style={{ backgroundColor: "#EEF2FF" }}
                    >
                      <Text
                        className="text-[13px] font-medium"
                        style={{ color: Colors.primary }}
                      >
                        {amenity}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: Colors.textSecondary }}>
                    Chưa có thông tin tiện ích.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </FormSection>
      ) : null}

      <View className="gap-4 pb-8">
        <AppButton
          title="Tạo phòng"
          onPress={onSubmit}
          loading={form.loading}
          disabled={!form.isFormValid}
        />

        <Pressable
          onPress={onCancel}
          className="h-[52px] items-center justify-center rounded-2xl"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <Text
            className="text-[16px] font-bold"
            style={{ color: Colors.textPrimary }}
          >
            Hủy
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
