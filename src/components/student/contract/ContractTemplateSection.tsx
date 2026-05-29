import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, LayoutAnimation, UIManager, Platform } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useContractTemplate } from "@/hooks/student/useContractTemplate";
import Markdown from "react-native-markdown-display";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  templateId?: string;
  template?: {
    code: string;
    name: string;
    version: number;
    content: string;
  } | null;
};

export function ContractTemplateSection({ templateId, template: propTemplate }: Props) {
  const { template: fetchedTemplate, loading } = useContractTemplate(propTemplate ? undefined : templateId);
  const template = propTemplate || fetchedTemplate;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (loading || !template) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="mt-2 bg-slate-900 rounded-[24px] overflow-hidden">
      <Pressable 
        onPress={toggleExpand}
        disabled={loading || !template}
        className="p-6 flex-row items-center justify-between"
      >
        <View className="flex-1 mr-4">
          <Text className="text-white font-bold text-[16px] mb-1">Điều khoản hợp đồng</Text>
          <Text className="text-slate-400 text-[13px]">
            {loading ? "Đang tải mẫu hợp đồng..." : (template ? template.name : "Xem chi tiết các điều khoản và quy định")}
          </Text>
        </View>
        <View className={`h-12 w-12 rounded-full items-center justify-center ${loading || !template ? "bg-white/5" : "bg-white/10"}`}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={template ? "white" : Colors.textSecondary} 
            />
          )}
        </View>
      </Pressable>

      {isExpanded && template && (
        <View className="px-6 pb-6 pt-2 border-t border-slate-800">
          <View className="mb-4 p-4 bg-slate-800 rounded-2xl">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="information" size={20} color={Colors.primaryLight} />
              <Text className="text-[14px] font-bold text-primaryLight ml-2">Thông tin mẫu</Text>
            </View>
            <Text className="text-[13px] text-slate-300 mb-1"><Text className="font-bold text-white">Mã:</Text> {template.code}</Text>
            <Text className="text-[13px] text-slate-300"><Text className="font-bold text-white">Phiên bản:</Text> {template.version}</Text>
          </View>

          <View className="bg-slate-800 p-5 rounded-2xl">
            {template.content ? (
              <Markdown
                style={{
                  body: { fontSize: 14, color: Colors.surface, lineHeight: 22 },
                  heading1: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10, color: Colors.surface },
                  heading2: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 10, color: Colors.surface },
                  strong: { fontWeight: 'bold', color: Colors.surface },
                  paragraph: { marginBottom: 10 },
                }}
              >
                {template.content}
              </Markdown>
            ) : (
              <Text className="text-slate-400 text-center italic">Không có nội dung điều khoản.</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
