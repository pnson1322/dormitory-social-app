import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MyRoomHeader } from "@/components/student/my-room/MyRoomHeader";
import { ActiveRoomCard } from "@/components/student/my-room/ActiveRoomCard";


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

        <View className="mt-10 pb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[20px] font-bold text-slate-900">Lịch sử đăng ký</Text>
            <Pressable>
              <Text className="text-primary font-bold">Xem tất cả</Text>
            </Pressable>
          </View>
          <View className="p-5 rounded-3xl bg-slate-50 border border-slate-100 border-dashed items-center py-10">
            <Ionicons name="receipt-outline" size={32} color="#CBD5E1" />
            <Text className="text-slate-400 font-medium mt-3">Chưa có dữ liệu lịch sử</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
