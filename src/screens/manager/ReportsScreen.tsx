import { KanbanColumn } from "@/components/manager/incident/KanbanColumn";
import { KanbanTabSelector } from "@/components/manager/incident/KanbanTabSelector";
import { IncidentDetailModal } from "@/components/student/incident/IncidentDetailModal";
import { Colors } from "@/constants/colors";
import { ManagerTabStatus, useManagerIncidents } from "@/hooks/manager/useManagerIncidents";
import { IncidentResponse } from "@/services/incident/incident.types";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_KEYS: ManagerTabStatus[] = ["Pending", "InProgress", "Resolved", "Rejected"];

export function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const {
    incidentsMap,
    loadingMap,
    hasMoreMap,
    errorMap,
    refreshStatus,
    loadMoreStatus,
    updateStatus,
    rejectIncident,
  } = useManagerIncidents();

  const [activeTab, setActiveTab] = useState<ManagerTabStatus>("Pending");
  const [selectedIncident, setSelectedIncident] = useState<IncidentResponse | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  const handleTabPress = (tabKey: ManagerTabStatus, index: number) => {
    setActiveTab(tabKey);
    scrollRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < TAB_KEYS.length) {
      setActiveTab(TAB_KEYS[index]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 22,
          paddingBottom: 30,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#FFF" }}>
          Quản lý sự cố
        </Text>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", marginTop: 4 }}>
          Tiếp nhận và cập nhật tiến độ xử lý sự cố
        </Text>
      </LinearGradient>

      <KanbanTabSelector
        activeTab={activeTab}
        onTabPress={handleTabPress}
        incidentsMap={incidentsMap}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
      >
        {TAB_KEYS.map((tabKey) => (
          <View key={tabKey} style={{ width: SCREEN_WIDTH }}>
            <KanbanColumn
              status={tabKey}
              list={incidentsMap[tabKey] || []}
              isLoading={loadingMap[tabKey]}
              isError={errorMap[tabKey]}
              hasMore={hasMoreMap[tabKey]}
              refreshStatus={refreshStatus}
              loadMoreStatus={loadMoreStatus}
              updateStatus={updateStatus}
              rejectIncident={rejectIncident}
              onSelectIncident={setSelectedIncident}
              onSwipeStart={() => scrollRef.current?.setNativeProps({ scrollEnabled: false })}
              onSwipeEnd={() => scrollRef.current?.setNativeProps({ scrollEnabled: true })}
            />
          </View>
        ))}
      </ScrollView>

      <IncidentDetailModal
        visible={!!selectedIncident}
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        isAdminOrManager={true}
      />
    </View>
  );
}
