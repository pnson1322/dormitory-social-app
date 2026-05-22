import React from "react";
import { Text, View } from "react-native";

export interface PostRenderingStrategy {
  getBadgeColor(): string;
  getBadgeBgColor(): string;
  getBadgeLabel(): string;
  getCardBorderColor(): string;
  getBadgeIconName(): "chatbubble-ellipses-outline" | "search-outline" | "megaphone-outline";
  renderCustomContent?(post: any): React.JSX.Element | null;
}

export class GeneralPostStrategy implements PostRenderingStrategy {
  getBadgeColor() {
    return "#3B82F6"; 
  }
  getBadgeBgColor() {
    return "#EFF6FF";
  }
  getBadgeLabel() {
    return "Thảo luận";
  }
  getCardBorderColor() {
    return "#E2E8F0";
  }
  getBadgeIconName() {
    return "chatbubble-ellipses-outline" as const;
  }
}

export class LostAndFoundPostStrategy implements PostRenderingStrategy {
  getBadgeColor() {
    return "#0D9488";
  }
  getBadgeBgColor() {
    return "#F0FDFA";
  }
  getBadgeLabel() {
    return "Tìm đồ thất lạc";
  }
  getCardBorderColor() {
    return "#CCFBF1";
  }
  getBadgeIconName() {
    return "search-outline" as const;
  }
  renderCustomContent(post: any) {
    return (
      <View className="mt-2.5 p-3 bg-teal-50/70 rounded-lg border border-teal-200">
        <Text className="text-[13px] font-semibold text-teal-800">
          💡 Tin thất lạc: Hãy bình luận hoặc nhắn tin trực tiếp nếu bạn có thông tin nhé!
        </Text>
      </View>
    );
  }
}

export class AnnouncementPostStrategy implements PostRenderingStrategy {
  getBadgeColor() {
    return "#EF4444";
  }
  getBadgeBgColor() {
    return "#FEF2F2";
  }
  getBadgeLabel() {
    return "Thông báo KTX";
  }
  getCardBorderColor() {
    return "#FCA5A5";
  }
  getBadgeIconName() {
    return "megaphone-outline" as const;
  }
  renderCustomContent(post: any) {
    return (
      <View className="mt-3 p-3 bg-rose-50/70 rounded-lg border border-rose-200">
        <Text className="text-[13px] font-semibold text-rose-800">
          📌 Thông báo chính thức từ BQL ký túc xá.
        </Text>
      </View>
    );
  }
}

export class PostStrategyFactory {
  static getStrategy(postType: string): PostRenderingStrategy {
    switch (postType) {
      case "LostAndFound":
        return new LostAndFoundPostStrategy();
      case "Announcement":
        return new AnnouncementPostStrategy();
      case "General":
      default:
        return new GeneralPostStrategy();
    }
  }
}
