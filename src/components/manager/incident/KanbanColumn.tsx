import React from "react";
import { View, Text, ScrollView, FlatList, RefreshControl, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { ManagerTabStatus } from "@/hooks/manager/useManagerIncidents";
import { IncidentResponse } from "@/services/incident/incident.types";
import { SwipeableRow } from "@/components/common/SwipeableRow";
import { ManagerIncidentItem } from "./ManagerIncidentItem";
import { IncidentSkeleton } from "@/components/student/incident/IncidentSkeleton";
import { IncidentErrorView } from "@/components/student/incident/IncidentErrorView";

interface Props {
  status: ManagerTabStatus;
  list: IncidentResponse[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  refreshStatus: (status: ManagerTabStatus) => void;
  loadMoreStatus: (status: ManagerTabStatus) => void;
  updateStatus: (id: string, currentStatus: ManagerTabStatus, targetStatus: ManagerTabStatus) => void;
  rejectIncident: (id: string, currentStatus: ManagerTabStatus) => void;
  onSelectIncident: (item: IncidentResponse) => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export function KanbanColumn({
  status,
  list,
  isLoading,
  isError,
  hasMore,
  refreshStatus,
  loadMoreStatus,
  updateStatus,
  rejectIncident,
  onSelectIncident,
  onSwipeStart,
  onSwipeEnd,
}: Props) {
  const renderEmptyState = () => {
    let iconName: keyof typeof Ionicons.glyphMap = "clipboard-outline";
    let title = "Không có sự cố nào";
    let sub = "Hệ thống hiện tại sạch sẽ, không có báo cáo.";

    if (status === "Pending") {
      iconName = "shield-checkmark-outline";
      title = "Hộp thư trống";
      sub = "Không có báo cáo sự cố mới nào chờ xử lý.";
    } else if (status === "InProgress") {
      iconName = "hourglass-outline";
      title = "Không có việc đang làm";
      sub = "Mọi sự cố tiếp nhận đã được giải quyết xong.";
    }

    return (
      <View className="flex-1 items-center justify-center py-16 px-6">
        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
          <Ionicons name={iconName} size={28} color="#94A3B8" />
        </View>
        <Text className="text-base font-bold text-slate-800 text-center mb-1">
          {title}
        </Text>
        <Text className="text-xs text-slate-400 text-center leading-relaxed max-w-[240px]">
          {sub}
        </Text>
      </View>
    );
  };

  if (isError) {
    return <IncidentErrorView onRetry={() => refreshStatus(status)} />;
  }

  if (isLoading && list.length === 0) {
    return (
      <ScrollView className="flex-1 px-5 pt-4">
        <IncidentSkeleton />
        <IncidentSkeleton />
        <IncidentSkeleton />
      </ScrollView>
    );
  }

  const renderFooter = () => {
    if (!isLoading || list.length === 0 || !hasMore) return null;
    return (
      <View className="py-5 items-center justify-center">
        <ActivityIndicator color={Colors.primary} size="small" />
      </View>
    );
  };

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if (status === "Pending") {
          return (
            <SwipeableRow
              leftAction={() => updateStatus(item.id, "Pending", "InProgress")}
              leftLabel="Tiếp nhận"
              leftColor="#3B82F6"
              leftIcon="play-circle-outline"
              rightAction={() => rejectIncident(item.id, "Pending")}
              rightLabel="Từ chối"
              rightColor="#EF4444"
              rightIcon="close-circle-outline"
              onSwipeStart={onSwipeStart}
              onSwipeEnd={onSwipeEnd}
            >
              <Pressable
                onPress={() => onSelectIncident(item)}
              >
                {({ pressed }) => (
                  <ManagerIncidentItem item={item} pressed={pressed} />
                )}
              </Pressable>
            </SwipeableRow>
          );
        }

        if (status === "InProgress") {
          return (
            <SwipeableRow
              leftAction={() => updateStatus(item.id, "InProgress", "Resolved")}
              leftLabel="Hoàn thành"
              leftColor="#10B981"
              leftIcon="checkmark-circle-outline"
              rightAction={() => rejectIncident(item.id, "InProgress")}
              rightLabel="Từ chối"
              rightColor="#EF4444"
              rightIcon="close-circle-outline"
              onSwipeStart={onSwipeStart}
              onSwipeEnd={onSwipeEnd}
            >
              <Pressable
                onPress={() => onSelectIncident(item)}
              >
                {({ pressed }) => (
                  <ManagerIncidentItem item={item} pressed={pressed} />
                )}
              </Pressable>
            </SwipeableRow>
          );
        }

        return (
          <Pressable
            onPress={() => onSelectIncident(item)}
            style={{ marginBottom: 16 }}
          >
            {({ pressed }) => (
              <ManagerIncidentItem item={item} pressed={pressed} />
            )}
          </Pressable>
        );
      }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState()}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && list.length > 0}
          onRefresh={() => refreshStatus(status)}
          colors={[Colors.primary]}
        />
      }
      onEndReached={() => loadMoreStatus(status)}
      onEndReachedThreshold={0.2}
    />
  );
}
