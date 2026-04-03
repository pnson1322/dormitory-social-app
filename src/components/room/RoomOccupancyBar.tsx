import { getOccupancyBarColor } from "@/utils/room";
import { View } from "react-native";

type Props = {
  percent: number;
};

export function RoomOccupancyBar({ percent }: Props) {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <View
      className="h-3 overflow-hidden rounded-full"
      style={{ backgroundColor: "#E2E8F0" }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${safePercent}%`,
          backgroundColor: getOccupancyBarColor(safePercent),
        }}
      />
    </View>
  );
}
