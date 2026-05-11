import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { RoommateItem } from "./RoommateItem";

type Roommate = {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
};

type Props = {
  name: string;
  buildingName: string;
  floor: number;
  roomTypeName: string;
  capacity: number;
  occupiedCount: number;
  roomStatus: string;
  roommates: Roommate[];
};

export function ActiveRoomCard({
  name,
  buildingName,
  floor,
  roomTypeName,
  capacity,
  occupiedCount,
  roomStatus,
  roommates,
}: Props) {
  const occupancyPercent = (occupiedCount / capacity) * 100;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return { label: "Hoạt động", color: "#10B981", bg: "#ECFDF5", icon: "checkmark-circle" };
      case "MAINTENANCE":
        return { label: "Đang bảo trì", color: "#F59E0B", bg: "#FFFBEB", icon: "alert-circle" };
      case "FULL":
        return { label: "Đã đầy", color: "#6366F1", bg: "#EEF2FF", icon: "people" };
      default:
        return { label: "N/A", color: "#94A3B8", bg: "#F8FAFC", icon: "help-circle" };
    }
  };

  const status = getStatusInfo(roomStatus);

  return (
    <View 
      className="rounded-[32px] overflow-hidden bg-white"
      style={{ 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8
      }}
    >
      <View className="px-6 py-5 border-b border-slate-50">
        <View className="flex-row justify-between items-start">
          <View>
            <View className="flex-row items-center mb-2">
              <View 
                className="px-3 py-1 rounded-full flex-row items-center"
                style={{ backgroundColor: status.bg }}
              >
                <Ionicons name={status.icon as any} size={14} color={status.color} />
                <Text className="ml-1.5 font-bold text-[11px] uppercase tracking-wider" style={{ color: status.color }}>
                  {status.label}
                </Text>
              </View>
            </View>
            <Text className="text-slate-900 text-[26px] font-black">
              Phòng {name}
            </Text>
            <Text className="text-slate-400 font-bold text-[14px] mt-0.5">
              {buildingName} • Tầng {floor}
            </Text>
          </View>
          
          <View className="h-12 w-12 rounded-2xl bg-primary/5 items-center justify-center">
            <Ionicons name="key-outline" size={24} color={Colors.primary} />
          </View>
        </View>
      </View>

      <View className="p-6">
        <View className="flex-row items-center mb-6">
          <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center mr-4">
            <Ionicons name="business" size={24} color={Colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-[12px] font-bold uppercase">Loại phòng</Text>
            <Text className="text-slate-900 text-[16px] font-bold">{roomTypeName}</Text>
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between items-end mb-2">
            <Text className="text-slate-900 font-bold text-[16px]">Sức chứa</Text>
            <Text className="text-primary font-black text-[18px]">
              {occupiedCount}/{capacity} <Text className="text-[14px] text-slate-400 font-medium">thành viên</Text>
            </Text>
          </View>
          <View className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${occupancyPercent}%` }} 
            />
          </View>

        </View>

        <View className="h-[1px] bg-slate-100 mb-6" />

        <Text className="text-slate-900 font-bold text-[16px] mb-4">Bạn cùng phòng</Text>
        <View className="gap-4">
          {roommates.map((member) => (
            <RoommateItem 
              key={member.id} 
              name={member.name} 
              studentId={member.studentId} 
              avatar={member.avatar} 
            />
          ))}
        </View>
      </View>
    </View>
  );
}
