import { DraggableFAB } from "@/components/common/DraggableFAB";
import { IncidentEmptyState } from "@/components/student/incident/IncidentEmptyState";
import { IncidentErrorView } from "@/components/student/incident/IncidentErrorView";
import { IncidentFilterTabs } from "@/components/student/incident/IncidentFilterTabs";
import { IncidentItem } from "@/components/student/incident/IncidentItem";
import { IncidentSkeleton } from "@/components/student/incident/IncidentSkeleton";
import { IncidentDetailModal } from "@/components/student/incident/IncidentDetailModal";
import { Colors } from "@/constants/colors";
import { useIncidents } from "@/hooks/student/useIncidents";
import { IncidentResponse } from "@/services/incident/incident.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DUMMY_ROOM_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

export function IncidentListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedIncident, setSelectedIncident] = useState<IncidentResponse | null>(null);
  
  const { 
    incidents, 
    isLoading, 
    isError, 
    status, 
    setStatus, 
    loadMore, 
    refresh, 
  } = useIncidents(DUMMY_ROOM_ID);

  const renderItem = ({ item }: { item: IncidentResponse }) => (
    <Pressable onPress={() => setSelectedIncident(item)}>
      <IncidentItem item={item} />
    </Pressable>
  );

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

      <IncidentFilterTabs currentStatus={status} onStatusChange={setStatus} />

      <View style={{ flex: 1 }}>
        {isError ? (
          <IncidentErrorView onRetry={refresh} />
        ) : isLoading && incidents.length === 0 ? (
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <IncidentSkeleton />
            <IncidentSkeleton />
            <IncidentSkeleton />
          </ScrollView>
        ) : (
          <FlatList
            data={incidents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading && incidents.length > 0}
            onRefresh={refresh}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<IncidentEmptyState />}
          />
        )}
      </View>
      <DraggableFAB onPress={() => router.push("/(student)/report-incident")} />
      
      <IncidentDetailModal 
        visible={selectedIncident !== null}
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </View>
  );
}
