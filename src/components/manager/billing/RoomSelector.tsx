import { Colors } from "@/constants/colors";
import { RoomItem } from "@/services/room/room.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  rooms: RoomItem[];
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
  search: string;
  onSearchChange: (text: string) => void;
  loadingMore?: boolean;
  onLoadMore?: () => void;
};

export function RoomSelector({ 
  rooms, 
  selectedRoomId, 
  onSelect, 
  search, 
  onSearchChange,
  loadingMore,
  onLoadMore
}: Props) {
  return (
    <View className="flex-1">
      <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 h-12 mb-4">
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          placeholder="Tìm phòng (Số phòng, tòa nhà...)"
          className="flex-1 ml-2 text-[15px] text-slate-900 h-full"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = item.id === selectedRoomId;
          return (
            <Pressable
              onPress={() => onSelect(item.id)}
              className={`flex-row items-center p-4 rounded-2xl mb-3 border ${
                selected ? "bg-blue-50 border-primary" : "bg-white border-slate-100"
              }`}
            >
              <View className={`h-10 w-10 rounded-full items-center justify-center mr-3 ${
                selected ? "bg-primary" : "bg-slate-100"
              }`}>
                <Ionicons name="business" size={20} color={selected ? "white" : Colors.primary} />
              </View>
              <View className="flex-1">
                <Text className={`font-bold ${selected ? "text-primary" : "text-slate-900"}`}>
                  Phòng {item.name}
                </Text>
                <Text className="text-[12px] text-slate-500">{item.buildingName} - {item.roomTypeName}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={Colors.primary} className="py-4" /> : null}
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-slate-400">Không tìm thấy phòng phù hợp</Text>
          </View>
        }
      />
    </View>
  );
}
