import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, FlatList, TextInput, TouchableOpacity, View } from "react-native";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (text: string) => void;
  selectedImages: string[];
  handlePickImages: () => void;
  handleRemoveImage: (index: number) => void;
  handleSend: () => void;
  isSending: boolean;
  triggerTyping: () => void;
  bottomInset: number;
}

export function MessageInput({
  inputMessage,
  setInputMessage,
  selectedImages,
  handlePickImages,
  handleRemoveImage,
  handleSend,
  isSending,
  triggerTyping,
  bottomInset,
}: MessageInputProps) {
  return (
    <View className="bg-white border-t border-slate-100">
      {selectedImages.length > 0 && (
        <View className="px-5 py-3 border-b border-slate-100 bg-white">
          <FlatList
            data={selectedImages}
            horizontal
            contentContainerStyle={{ paddingRight: 20, paddingTop: 6 }}
            keyExtractor={(item, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: 92,
                  height: 92,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  marginRight: 12,
                  position: "relative",
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: "#E2E8F0" }}
                  contentFit="cover"
                />
                <TouchableOpacity
                  onPress={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "rgba(0,0,0,0.75)",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "white",
                    zIndex: 10,
                  }}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      <View
        className="flex-row items-center px-4 py-3 bg-white gap-3"
        style={{ paddingBottom: bottomInset }}
      >
        <TouchableOpacity
          onPress={handlePickImages}
          className="w-11 h-11 rounded-full bg-slate-50 items-center justify-center border border-slate-100"
        >
          <Ionicons name="image" size={20} color="#64748B" />
        </TouchableOpacity>

        <View className="flex-1 bg-slate-50 rounded-2xl px-4 py-2.5 flex-row items-center border border-slate-100">
          <TextInput
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-800 text-[15px] p-0 max-h-[100px]"
            multiline
            value={inputMessage}
            onChangeText={(text) => {
              setInputMessage(text);
              triggerTyping();
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSend}
          disabled={isSending || (!inputMessage.trim() && selectedImages.length === 0)}
          className={`w-11 h-11 rounded-full items-center justify-center ${
            !inputMessage.trim() && selectedImages.length === 0 ? "bg-slate-100" : "bg-blue-600"
          }`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons
              name="send"
              size={16}
              color={!inputMessage.trim() && selectedImages.length === 0 ? "#94A3B8" : "white"}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
