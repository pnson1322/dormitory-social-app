import { DraggableFAB } from "@/components/common/DraggableFAB";
import { IncidentEmptyState } from "@/components/student/incident/IncidentEmptyState";
import { IncidentErrorView } from "@/components/student/incident/IncidentErrorView";
import { IncidentFilterTabs } from "@/components/student/incident/IncidentFilterTabs";
import { IncidentItem } from "@/components/student/incident/IncidentItem";
import { IncidentSkeleton } from "@/components/student/incident/IncidentSkeleton";
import { IncidentDetailModal } from "@/components/student/incident/IncidentDetailModal";
import { Colors } from "@/constants/colors";
import { useIncidents } from "@/hooks/student/useIncidents";
import { useMyRoom } from "@/hooks/student/useMyRoom";
import { IncidentResponse } from "@/services/incident/incident.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function IncidentListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedIncident, setSelectedIncident] = useState<IncidentResponse | null>(null);
  
  const { roomInfo, loading: roomLoading, refresh: refreshRoom } = useMyRoom();
  const activeRoomId = roomInfo?.roomId || "";

  const { 
    incidents, 
    isLoading, 
    isError, 
    status, 
    setStatus, 
    loadMore, 
    refresh, 
  } = useIncidents(activeRoomId);

  const renderItem = ({ item }: { item: IncidentResponse }) => (
    <Pressable onPress={() => setSelectedIncident(item)}>
      <IncidentItem item={item} />
    </Pressable>
  );

  const handleRefresh = async () => {
    await refreshRoom();
    refresh();
  };

  const renderFooter = () => {
    if (isLoading && incidents.length > 0) {
      return (
        <View className="py-4 justify-center items-center">
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    }
    return null;
  };

  const renderBody = () => {
    if (roomLoading || (isLoading && incidents.length === 0)) {
      return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <IncidentSkeleton />
          <IncidentSkeleton />
          <IncidentSkeleton />
        </ScrollView>
      );
    }

    if (!activeRoomId) {
      return (
        <View className="flex-1 items-center justify-center p-8 bg-white m-5 rounded-[32px] border border-slate-100 shadow-sm">
          <View className="h-16 w-16 bg-red-50 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="warning-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-slate-800 font-black text-[18px] text-center">Chưa có thông tin phòng</Text>
          <Text className="text-slate-500 text-[14px] mt-2 text-center leading-6 px-4">
            Bạn cần phải có phòng ký túc xá hoạt động để có thể báo cáo và theo dõi các sự cố cơ sở vật chất.
          </Text>
        </View>
      );
    }

    if (isError) {
      return <IncidentErrorView onRetry={handleRefresh} />;
    }

    return (
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading && incidents.length > 0}
        onRefresh={handleRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<IncidentEmptyState />}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-4 z-10"
        style={{
          paddingTop: Math.max(insets.top, 20) + 10,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.navigate("/(student)/menu" as any)}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <Text className="text-[22px] font-extrabold text-white">
            Danh sách sự cố
          </Text>
        </View>
      </View>

      {!!activeRoomId && (
        <IncidentFilterTabs currentStatus={status} onStatusChange={setStatus} />
      )}

      <View style={{ flex: 1 }}>
        {renderBody()}
      </View>
      
      {!!activeRoomId && (
        <DraggableFAB onPress={() => router.push("/(student)/report-incident")} />
      )}
      
      <IncidentDetailModal 
        visible={selectedIncident !== null}
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </View>
  );
}
