import { RoomStatus } from "@/services/room.api";
import { getRoomStatusColors, roomStatusToVietnamese } from "@/utils/room";
import { Text, View } from "react-native";

type Props = {
  status: RoomStatus;
};

export function RoomStatusBadge({ status }: Props) {
  const colors = getRoomStatusColors(status);

  return (
    <View
      className="flex-row items-center rounded-full px-3 py-2"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="mr-2 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: colors.dot }}
      />
      <Text className="text-[12px] font-bold" style={{ color: colors.text }}>
        {roomStatusToVietnamese(status)}
      </Text>
    </View>
  );
}
