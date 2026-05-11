import { ActiveRoomCard } from "@/components/student/my-room/ActiveRoomCard";
import { MyRoomHeader } from "@/components/student/my-room/MyRoomHeader";
import { RecentRegistrations } from "@/components/student/my-room/RecentRegistrations";
import { RoomActionButtons } from "@/components/student/my-room/RoomActionButtons";
import { Colors } from "@/constants/colors";
import { ScrollView, View } from "react-native";

const MOCK_CURRENT_ROOM = {
  name: "101",
  buildingName: "Tòa A1",
  floor: 1,
  roomTypeName: "Phòng 4 người (Tiêu chuẩn)",
  capacity: 4,
  occupiedCount: 3,
  roomStatus: "AVAILABLE",
  roommates: [
    { id: "1", name: "Nguyễn Văn A", studentId: "SV001", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Trần Thị B", studentId: "SV002", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Lê Văn C", studentId: "SV003", avatar: "https://i.pravatar.cc/150?u=3" },
  ]
};

export function MyRoomScreen() {
  const room = MOCK_CURRENT_ROOM;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <MyRoomHeader />

      <ScrollView 
        className="flex-1 -mt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        <ActiveRoomCard 
          name={room.name}
          buildingName={room.buildingName}
          floor={room.floor}
          roomTypeName={room.roomTypeName}
          capacity={room.capacity}
          occupiedCount={room.occupiedCount}
          roomStatus={room.roomStatus}
          roommates={room.roommates}
        />

        <RoomActionButtons />

        <RecentRegistrations />
      </ScrollView>
    </View>
  );
}
