import { AppButton } from "@/components/AppButton";
import { BookingFeeList } from "@/components/student/room/booking/BookingFeeList";
import { BookingRoomInfo } from "@/components/student/room/booking/BookingRoomInfo";
import { BookingSummary } from "@/components/student/room/booking/BookingSummary";
import { BookingTermSelector } from "@/components/student/room/booking/BookingTermSelector";
import { BookingTerms } from "@/components/student/room/booking/BookingTerms";
import { Colors } from "@/constants/colors";
import { useRoomBooking } from "@/hooks/student/useRoomBooking";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { QrPaymentModal } from "@/components/student/billing/QrPaymentModal";
import { getBuildings } from "@/services/room/room.api";
import { BuildingItem } from "@/services/room/room.types";

export function StudentRoomBookingScreen() {
  const { id } = useLocalSearchParams();
  const roomId = id as string;
  const insets = useSafeAreaInsets();

  const {
    room,
    loading: bookingLoading,
    error,
    terms,
    selectedTerm,
    setSelectedTerm,
    mandatoryFees,
    optionalFees,
    selectedOptionalFees,
    toggleOptionalFee,
    estimatedInitialTotal,
    agreed,
    setAgreed,
    isSubmitting,
    goBack,
    submitBooking,
  } = useRoomBooking(roomId);

  const [showPaymentQr, setShowPaymentQr] = useState(false);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);

  useEffect(() => {
    const fetchBuildingsList = async () => {
      try {
        setBuildingsLoading(true);
        const data = await getBuildings();
        setBuildings(data || []);
      } catch (err) {
        console.log("Error fetching buildings list:", err);
      } finally {
        setBuildingsLoading(false);
      }
    };
    fetchBuildingsList();
  }, []);

  const selectedBuilding = buildings.find(b => b.id === room?.buildingId);

  const handleQrConfirm = async () => {
    await submitBooking();
    setShowPaymentQr(false);
  };

  const loading = bookingLoading || buildingsLoading;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !room) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="px-5 pb-5" style={{ paddingTop: insets.top - 10, backgroundColor: Colors.primary }}>
          <View className="flex-row items-center">
            <Pressable onPress={goBack} className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text className="text-[24px] font-extrabold text-white">Đăng ký phòng</Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-[18px] font-semibold mb-8 text-slate-900">{error || "Lỗi tải thông tin"}</Text>
          <AppButton title="Quay lại" onPress={goBack} size="compact" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-5 z-10"
        style={{
          paddingTop: insets.top - 10,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={goBack}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <Text className="text-[24px] font-extrabold text-white">
            Đăng ký phòng
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <BookingRoomInfo room={room} />

        <BookingTermSelector
          terms={terms}
          selectedTerm={selectedTerm}
          onSelectTerm={setSelectedTerm}
        />

        <BookingFeeList
          basePrice={room.basePrice}
          mandatoryFees={mandatoryFees}
          optionalFees={optionalFees}
          selectedOptionalFees={selectedOptionalFees}
          onToggleOptionalFee={toggleOptionalFee}
        />

        <BookingSummary estimatedTotal={estimatedInitialTotal} />

        <BookingTerms agreed={agreed} onAgreedChange={setAgreed} roomTypeId={room?.roomTypeId} />

        <AppButton
          title="Xác nhận đăng ký"
          onPress={() => setShowPaymentQr(true)}
          loading={isSubmitting}
          disabled={!agreed || isSubmitting}
        />
      </ScrollView>

      <QrPaymentModal
        visible={showPaymentQr}
        onClose={() => setShowPaymentQr(false)}
        amount={estimatedInitialTotal}
        memo={`DKP${room.name.replace(/\s+/g, "").toUpperCase()}`}
        bankCode={selectedBuilding?.bankCode}
        accountNumber={selectedBuilding?.accountNumber}
        accountName={selectedBuilding?.accountName}
        onConfirm={handleQrConfirm}
        isConfirming={isSubmitting}
      />
    </SafeAreaView>
  );
}
