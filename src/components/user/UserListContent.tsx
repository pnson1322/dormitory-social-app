import { UserCard } from "@/components/user/UserCard";
import { Colors } from "@/constants/colors";
import { UserItem } from "@/services/user.api";
import { memo } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

type Props = {
  items: UserItem[];
  refreshing: boolean;
  onRefresh: () => void;
  onPressUser: (user: UserItem) => void;
  onOpenMenu: (user: UserItem) => void;
};

function UserListContentBase({
  items,
  refreshing,
  onRefresh,
  onPressUser,
  onOpenMenu,
}: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      className="flex-1"
      contentContainerStyle={{
        paddingTop: 6,
        paddingBottom: 120,
        gap: 16,
      }}
      renderItem={({ item }) => (
        <View className="px-5">
          <UserCard
            user={{
              ...item,
              status: item.isActive ? "active" : "locked",
            }}
            onPress={() => onPressUser(item)}
            onPressMenu={() => onOpenMenu(item)}
          />
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View className="px-5">
          <View
            className="mt-2 rounded-[24px] p-5"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              className="text-[15px]"
              style={{ color: Colors.textSecondary }}
            >
              Không có người dùng nào phù hợp.
            </Text>
          </View>
        </View>
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={8}
      windowSize={8}
    />
  );
}

export const UserListContent = memo(UserListContentBase);
