import { Colors } from "@/constants/colors";
import { LocalComment } from "@/hooks/community/usePostInteraction";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface PostCardCommentsProps {
  commentsList: LocalComment[];
  commentText: string;
  setCommentText: (text: string) => void;
  handleSendComment: () => Promise<void>;
  formatDate: (dateString: string) => string;
}

export function PostCardComments({
  commentsList,
  commentText,
  setCommentText,
  handleSendComment,
  formatDate,
}: PostCardCommentsProps) {
  return (
    <View className="mt-3 pt-3 border-t pb-4" style={{ borderColor: Colors.border }}>
      {commentsList.map((comment) => (
        <View key={comment.id} className="mb-2.5 bg-slate-50 p-2.5 rounded-xl">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-[13px] font-bold" style={{ color: Colors.textPrimary }}>
              {comment.authorName}
            </Text>
            <Text className="text-[11px]" style={{ color: Colors.textSecondary }}>
              {formatDate(comment.createdAt)}
            </Text>
          </View>
          <Text className="text-[13px] leading-5" style={{ color: Colors.textPrimary }}>
            {comment.content}
          </Text>
        </View>
      ))}

      <View className="flex-row items-center mt-2 pt-2 border-t" style={{ borderColor: Colors.border }}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Viết bình luận..."
          placeholderTextColor={Colors.textSecondary}
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-[13px]"
          style={{ color: Colors.textPrimary }}
          maxLength={200}
        />
        <Pressable
          onPress={handleSendComment}
          disabled={!commentText.trim()}
          className="ml-2 w-8 h-8 rounded-full items-center justify-center bg-blue-600 disabled:opacity-40"
          style={commentText.trim() ? { backgroundColor: Colors.primary } : {}}
        >
          <Ionicons name="send" size={14} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
