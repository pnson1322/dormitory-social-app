import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Colors } from "@/constants/colors";
import { StudentRoommate } from "@/services/booking/booking.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  students: StudentRoommate[];
  loading: boolean;
  onCheckout: (userId: string) => Promise<void>;
};

export function RoomResidentsCard({ students, loading, onCheckout }: Props) {
  const [selectedStudent, setSelectedStudent] = useState<StudentRoommate | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const handleCheckoutPress = (student: StudentRoommate) => {
    setSelectedStudent(student);
    setShowConfirm(true);
  };

  const handleConfirmCheckout = async () => {
    if (!selectedStudent) return;
    try {
      setCheckoutLoading(true);
      await onCheckout(selectedStudent.studentId);
      setShowConfirm(false);
      setSelectedStudent(null);
    } catch (err) {
      // Bubble error to parent screen to display toast
      throw err;
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <View
      className="rounded-[24px] p-5"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className="text-[18px] font-bold"
          style={{ color: Colors.textPrimary }}
        >
          Sinh viên hiện tại ({students.length})
        </Text>
        {loading && <ActivityIndicator size="small" color={Colors.primary} />}
      </View>

      {students.length === 0 ? (
        <View className="items-center py-6">
          <View className="h-12 w-12 rounded-full bg-slate-50 items-center justify-center mb-2">
            <Ionicons name="people-outline" size={24} color="#94A3B8" />
          </View>
          <Text className="text-[14px] text-slate-400 font-medium">
            Chưa có sinh viên nào trong phòng này.
          </Text>
        </View>
      ) : (
        <View className="gap-y-4">
          {students.map((student) => {
            const isMale = student.gender?.toLowerCase() === "male" || student.gender === "Nam";
            const isFemale = student.gender?.toLowerCase() === "female" || student.gender === "Nữ";
            const borderLeftColor = isMale ? "border-l-blue-500" : isFemale ? "border-l-pink-500" : "border-l-slate-400";
            return (
              <View
                key={student.studentId}
                className={`p-4 rounded-2xl border border-slate-100 bg-white border-l-4 ${borderLeftColor}`}
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.02,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1 mr-2">
                    {student.avatarUrl ? (
                      <Image
                        source={{ uri: student.avatarUrl }}
                        className="h-11 w-11 rounded-full mr-3"
                      />
                    ) : (
                      <View
                        className={`h-11 w-11 rounded-full mr-3 items-center justify-center ${
                          isMale ? "bg-blue-50" : isFemale ? "bg-pink-50" : "bg-slate-100"
                        }`}
                      >
                        <Text className={`font-bold text-[14px] ${
                          isMale ? "text-blue-600" : isFemale ? "text-pink-600" : "text-slate-600"
                        }`}>
                          {getInitials(student.fullName)}
                        </Text>
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-[16px] font-black text-slate-800" numberOfLines={1}>
                        {student.fullName || "Chưa thiết lập"}
                      </Text>
                      <Text className="text-[12px] text-slate-500 font-bold mt-0.5">
                        {student.studentCode ? `MSV: ${student.studentCode}` : "Chưa cập nhật MSV"}
                      </Text>
                    </View>
                  </View>
                  <View className={`px-2 py-0.5 rounded-full ${
                    isMale ? "bg-blue-50" : isFemale ? "bg-pink-50" : "bg-slate-100"
                  }`}>
                    <Text className={`text-[10px] font-black uppercase ${
                      isMale ? "text-blue-600" : isFemale ? "text-pink-600" : "text-slate-600"
                    }`}>
                      {student.gender || "Chưa chọn"}
                    </Text>
                  </View>
                </View>

                <View className="h-[1px] bg-slate-100 w-full my-2" />

                <View className="gap-y-2.5 mb-4">
                  <View className="flex-row items-center">
                    <Ionicons name="school-outline" size={14} color="#475569" />
                    <Text className="ml-2 text-[13px] text-slate-700 font-medium flex-1" numberOfLines={1}>
                      {student.school || "Chưa cập nhật trường"} {student.faculty ? `• ${student.faculty}` : ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={14} color="#475569" />
                    <Text className="ml-2 text-[13px] text-slate-700 font-medium">
                      Học kỳ: <Text className="font-bold text-slate-900">{student.termName}</Text>
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#475569" />
                    <Text className="ml-2 text-[13px] text-slate-600 font-medium">
                      Thời hạn: {formatDate(student.startDate)} - {formatDate(student.endDate)}
                    </Text>
                  </View>

                  {student.phoneNumber && (
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={14} color="#475569" />
                      <Text className="ml-2 text-[13px] text-slate-700 font-medium">{student.phoneNumber}</Text>
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={() => handleCheckoutPress(student)}
                  className="h-10 items-center justify-center rounded-xl bg-red-50 active:bg-red-100 border border-red-100/50 mt-1"
                >
                  <Text className="text-[13px] font-black text-red-600">
                    Check out
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      <ConfirmModal
        visible={showConfirm}
        title="Xác nhận Check-out sinh viên?"
        message={`Hệ thống sẽ tiến hành check-out sinh viên ${selectedStudent?.fullName || ""} khỏi phòng này và hoàn thành hợp đồng. Bạn có chắc chắn?`}
        onConfirm={handleConfirmCheckout}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedStudent(null);
        }}
        type="danger"
        confirmLabel="Xác nhận Check-out"
        loading={checkoutLoading}
      />
    </View>
  );
}
