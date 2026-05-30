import { AppModal } from "@/components/AppModal";
import { getFullImageUrl } from "@/utils/incident";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MessageItemProps {
  item: {
    id: string;
    content?: string | null;
    mediaUrls?: string[] | null;
    createdAt: string;
    senderId: string;
    senderName?: string | null;
    senderAvatar?: string | null;
    isDeleted: boolean;
    status?: "sending" | "sent" | "failed";
  };
  index: number;
  messages: any[];
  currentUserId: string;
  isGroup: boolean;
  onLongPress: (id: string, senderId: string) => void;
  onImagePress: (urls: string[], initialIndex: number) => void;
  onRetry?: (id: string, content: string, files?: string[]) => void;
  onDeleteFailed?: (id: string) => void;
}

export function MessageItem({
  item,
  index,
  messages,
  currentUserId,
  isGroup,
  onLongPress,
  onImagePress,
  onRetry,
  onDeleteFailed,
}: MessageItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const isMe = item.senderId === currentUserId;
  const showAvatar = !isMe && isGroup;

  const nextMsg = messages[index + 1];
  const isSameSender = nextMsg && nextMsg.senderId === item.senderId;

  const formatTimeHeader = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const isSameYear = d.getFullYear() === now.getFullYear();
    const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isToday) {
      return timeStr;
    }
    if (isYesterday) {
      return `Hôm qua ${timeStr}`;
    }
    if (isSameYear) {
      return `${d.getDate()}/${d.getMonth() + 1} ${timeStr}`;
    }
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${timeStr}`;
  };

  let showTimeHeader = false;
  if (!nextMsg) {
    showTimeHeader = true; 
  } else {
    const currentMsgDate = new Date(item.createdAt);
    const prevMsgDate = new Date(nextMsg.createdAt);
    const diffMs = currentMsgDate.getTime() - prevMsgDate.getTime();
    const diffMin = diffMs / (1000 * 60);
    const isDifferentDay = currentMsgDate.toDateString() !== prevMsgDate.toDateString();
    if (diffMin >= 10 || isDifferentDay) {
      showTimeHeader = true;
    }
  }

  const renderStatusIcon = (size: number, color: string) => {
    if (item.status === "sending") {
      return <Ionicons name="time-outline" size={size} color={color} />;
    }
    if (item.status === "failed") {
      return <Ionicons name="alert-circle-outline" size={size} color="#EF4444" />;
    }
    return <Ionicons name="checkmark-done" size={size} color={color} />;
  };

  const handleFailedPress = () => {
    setModalVisible(true);
  };

  const getSenderNameColor = (senderId: string) => {
    if (!senderId) return "#475569";
    let hash = 0;
    for (let i = 0; i < senderId.length; i++) {
      hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "#E11D48",
      "#EA580C",
      "#CA8A04",
      "#16A34A",
      "#0D9488",
      "#2563EB",
      "#7C3AED",
      "#D946EF",
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <View style={{ flexDirection: "column" }}>
      {showTimeHeader && (
        <View className="py-4 items-center justify-center">
          <Text className="text-slate-400 text-[11px] font-bold tracking-wide">
            {formatTimeHeader(item.createdAt)}
          </Text>
        </View>
      )}
      <View className={`flex-row px-5 py-1 ${isMe ? "justify-end" : "justify-start"}`}>
        {showAvatar && (
          <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mr-2 self-end">
            {item.senderAvatar && !avatarError ? (
              <Image 
                source={{ uri: getFullImageUrl(item.senderAvatar) }} 
                className="w-8 h-8 rounded-full" 
                onError={() => setAvatarError(true)}
              />
            ) : (
              <Text className="text-slate-600 font-extrabold text-[12px]">
                {(item.senderName || "U").charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        )}

        <View className="max-w-[75%]">
          {!isMe && isGroup && (!isSameSender || showTimeHeader) && (
            <Text 
              style={{ color: getSenderNameColor(item.senderId) }} 
              className="text-[11px] font-extrabold ml-2.5 mb-1"
            >
              {item.senderName || "Thành viên"}
            </Text>
          )}

          {item.isDeleted ? (
            <TouchableOpacity
              activeOpacity={1}
              className={`px-4 py-3 rounded-2xl ${
                isMe ? "bg-blue-600 rounded-tr-none" : "bg-slate-100 rounded-tl-none"
              }`}
              style={{
                elevation: 0.5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 1,
              }}
            >
              <Text className={`text-[14px] leading-[20px] italic ${isMe ? "text-white/70" : "text-slate-500"}`}>
                Tin nhắn đã bị thu hồi
              </Text>
              <View className="flex-row items-center justify-end mt-1 gap-1">
                <Text
                  className={`text-[9px] font-medium uppercase tracking-[0.5px] ${
                    isMe ? "text-white/60" : "text-slate-400"
                  }`}
                >
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                {isMe && <Ionicons name="checkmark-done" size={12} color="rgba(255,255,255,0.7)" />}
              </View>
            </TouchableOpacity>
          ) : (
            <View className={`flex-col ${isMe ? "items-end" : "items-start"}`}>
              {item.content ? (
                <View className="flex-row items-center">
                  {isMe && item.status === "failed" && (
                    <TouchableOpacity onPress={handleFailedPress} className="mr-2">
                      <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    activeOpacity={isMe ? 0.8 : 1}
                    onLongPress={() => item.status !== "sending" && item.status !== "failed" && onLongPress(item.id, item.senderId)}
                    disabled={item.status === "sending"}
                    className={`px-4 py-3 rounded-2xl ${
                      isMe ? "bg-blue-600 rounded-tr-none" : "bg-slate-100 rounded-tl-none"
                    }`}
                    style={{
                      elevation: 0.5,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 1,
                      marginBottom: item.mediaUrls && item.mediaUrls.length > 0 ? 6 : 0,
                      opacity: item.status === "sending" ? 0.6 : 1,
                    }}
                  >
                    <Text className={`text-[15px] leading-[22px] ${isMe ? "text-white" : "text-slate-800"}`}>
                      {item.content}
                    </Text>

                    <View className="flex-row items-center justify-end mt-1 gap-1">
                      <Text
                        className={`text-[9px] font-medium uppercase tracking-[0.5px] ${
                          isMe ? "text-white/60" : "text-slate-400"
                        }`}
                      >
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      {isMe && renderStatusIcon(12, "rgba(255,255,255,0.7)")}
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              {item.mediaUrls && item.mediaUrls.length > 0 && (
                <View className="flex-col gap-2">
                  {item.mediaUrls.map((url, i) => (
                    <View key={i} className="flex-row items-center">
                      {isMe && item.status === "failed" && i === 0 && (
                        <TouchableOpacity onPress={handleFailedPress} className="mr-2">
                          <Ionicons name="alert-circle" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={item.status === "sending"}
                        onPress={() => {
                          const fullUrls = item.mediaUrls!.map((mu) => getFullImageUrl(mu));
                          onImagePress(fullUrls, i);
                        }}
                        onLongPress={() => item.status !== "sending" && item.status !== "failed" && onLongPress(item.id, item.senderId)}
                        style={{
                          borderRadius: 16,
                          overflow: "hidden",
                          borderWidth: 1,
                          borderColor: isMe ? "#BFDBFE" : "#E2E8F0",
                          elevation: 0.5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 1,
                          opacity: item.status === "sending" ? 0.6 : 1,
                        }}
                      >
                        <Image
                          source={{ uri: getFullImageUrl(url) }}
                          style={{ width: 220, height: 220, backgroundColor: "#F1F5F9" }}
                          contentFit="cover"
                        />

                        {!item.content && i === item.mediaUrls!.length - 1 && (
                          <View
                            style={{
                              position: "absolute",
                              bottom: 6,
                              right: 8,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              paddingHorizontal: 6,
                              paddingVertical: 2.5,
                              borderRadius: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <Text style={{ color: "white", fontSize: 9, fontWeight: "500" }}>
                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                            {isMe && renderStatusIcon(10, "rgba(255,255,255,0.8)")}
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      <AppModal
        visible={modalVisible}
        type="confirm"
        title="Lỗi gửi tin nhắn"
        message="Bạn muốn thử gửi lại hay xóa tin nhắn này?"
        primaryText="Gửi lại"
        secondaryText="Xóa"
        onPrimary={() => {
          setModalVisible(false);
          onRetry?.(item.id, item.content || "", item.mediaUrls || []);
        }}
        onSecondary={() => {
          setModalVisible(false);
          onDeleteFailed?.(item.id);
        }}
        onBackdropPress={() => setModalVisible(false)}
      />
    </View>
  );
}
