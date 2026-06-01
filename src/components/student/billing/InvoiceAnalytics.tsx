import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, Pressable, Animated, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const PADDING_LEFT = 40;
const CHART_WIDTH = width - 40 - 48 - PADDING_LEFT; 
const CHART_HEIGHT = 120;

type DataPoint = {
  month: string;
  electricity: number;
  water: number;
};

type Props = {
  data: DataPoint[];
  loading?: boolean;
  error?: string | null;
};

export function InvoiceAnalytics({ data, loading = false, error = null }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  if (loading) {
    return (
      <View className="mb-6 bg-slate-900 rounded-[32px] p-6 shadow-2xl overflow-hidden">
        <View className="mb-8 flex-row justify-between items-start">
          <View className="gap-2">
            <View className="h-3 w-24 bg-slate-800 rounded-md overflow-hidden">
              <Animated.View style={{ opacity: pulseAnim, flex: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
            </View>
            <View className="h-6 w-36 bg-slate-800 rounded-md overflow-hidden">
              <Animated.View style={{ opacity: pulseAnim, flex: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
            </View>
          </View>
        </View>
        <View className="flex-row items-center justify-center" style={{ height: CHART_HEIGHT }}>
          <ActivityIndicator color={Colors.primary} size="small" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6 bg-slate-900 rounded-[32px] p-6 shadow-2xl items-center justify-center py-8">
        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" className="mb-2" />
        <Text className="text-red-400 text-[13px] font-bold text-center">{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="mb-6 bg-slate-900 rounded-[32px] p-6 shadow-2xl items-center justify-center py-8">
        <Ionicons name="analytics-outline" size={32} color="#94A3B8" className="mb-2" />
        <Text className="text-slate-400 text-[13px] font-bold text-center px-4">
          Chưa có lịch sử dịch vụ. Biểu đồ sẽ hiển thị khi bạn có hóa đơn đã thanh toán.
        </Text>
      </View>
    );
  }

  const allValues = data.flatMap(d => [d.electricity || 0, d.water || 0]);
  const maxAmount = Math.max(...allValues, 1000) * 1.2;
  const minAmount = 0;
  const range = maxAmount - minAmount || 1;

  const getPoints = (key: "electricity" | "water") => {
    return data.map((d, i) => {
      const divisor = data.length > 1 ? data.length - 1 : 1;
      const x = data.length > 1 
        ? (i / divisor) * CHART_WIDTH 
        : CHART_WIDTH / 2;
      const y = CHART_HEIGHT - ((d[key] - minAmount) / range) * CHART_HEIGHT;
      return { x, y };
    });
  };

  const renderLine = (points: { x: number; y: number }[], color: string) => {
    if (points.length < 2) return null;
    const lines = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      lines.push(
        <View
          key={i}
          style={{
            position: "absolute",
            left: midX - distance / 2,
            top: midY - 1,
            width: distance,
            height: 2,
            backgroundColor: color,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      );
    }
    return lines;
  };

  const handleTouch = (evt: any) => {
    if (data.length === 0) return;
    const x = evt.nativeEvent.locationX;
    const divisor = data.length > 1 ? data.length - 1 : 1;
    const index = Math.round((x / CHART_WIDTH) * divisor);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    setSelectedIndex(clampedIndex);
  };

  const yLabels = [maxAmount, maxAmount * 0.75, maxAmount * 0.5, maxAmount * 0.25, 0];
  const ePoints = getPoints("electricity");
  const wPoints = getPoints("water");

  return (
    <View className="mb-6 bg-slate-900 rounded-[32px] p-6 shadow-2xl overflow-hidden">
      <View className="mb-8 flex-row justify-between items-start">
        <View>
          <Text className="text-slate-300 text-[11px] font-bold uppercase tracking-[2px] mb-1">
            Lịch sử chi phí
          </Text>
          <Text className="text-white text-[22px] font-black">Phòng & Dịch vụ</Text>
        </View>
        <View className="gap-2">
          <View className="flex-row items-center">
            <View className="h-2 w-2 rounded-full bg-blue-400 mr-2" />
            <Text className="text-white/60 text-[10px] font-bold uppercase">Điện</Text>
          </View>
          <View className="flex-row items-center">
            <View className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
            <Text className="text-white/60 text-[10px] font-bold uppercase">Nước</Text>
          </View>
        </View>
      </View>

      <View className="flex-row mb-6">
        <View className="justify-between mr-2" style={{ height: CHART_HEIGHT }}>
          {yLabels.map((val, i) => (
            <Text key={i} className="text-slate-500 text-[9px] font-bold text-right" style={{ width: PADDING_LEFT - 10 }}>
              {val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : `${Math.round(val/1000)}k`}
            </Text>
          ))}
        </View>

        <View 
          style={{ height: CHART_HEIGHT, width: CHART_WIDTH }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouch}
          onResponderMove={handleTouch}
          onResponderRelease={() => setSelectedIndex(null)}
        >
          <View className="absolute inset-0 justify-between">
            {yLabels.map((_, i) => (
              <View key={i} className="h-[1px] w-full bg-white/5" />
            ))}
          </View>

          {renderLine(ePoints, "#60A5FA")}
          {renderLine(wPoints, "#34D399")}

          {selectedIndex !== null && ePoints[selectedIndex] && (
            <View 
              style={{ position: "absolute", left: ePoints[selectedIndex].x, top: 0, bottom: 0, width: 1, backgroundColor: "white", opacity: 0.3 }}
            />
          )}

          {ePoints.map((p, i) => (
            <View 
              key={`e-${i}`} 
              style={{ 
                position: "absolute", 
                left: p.x - 3, 
                top: p.y - 3,
                backgroundColor: selectedIndex === i ? "white" : "rgba(255, 255, 255, 0.4)",
                transform: [{ scale: selectedIndex === i ? 1.5 : 1 }]
              }} 
              className="h-1.5 w-1.5 rounded-full"
            />
          ))}
          {wPoints.map((p, i) => (
            <View 
              key={`w-${i}`} 
              style={{ 
                position: "absolute", 
                left: p.x - 3, 
                top: p.y - 3,
                backgroundColor: selectedIndex === i ? "white" : "rgba(255, 255, 255, 0.4)",
                transform: [{ scale: selectedIndex === i ? 1.5 : 1 }]
              }} 
              className="h-1.5 w-1.5 rounded-full"
            />
          ))}

          {selectedIndex !== null && data[selectedIndex] && ePoints[selectedIndex] && (
            <View 
              className="absolute bg-white rounded-2xl p-3 shadow-2xl border border-slate-100"
              style={{ 
                left: ePoints[selectedIndex].x > CHART_WIDTH / 2 ? ePoints[selectedIndex].x - 125 : ePoints[selectedIndex].x + 15,
                top: -10,
                width: 110
              }}
            >
              <Text className="text-slate-900 text-[12px] font-black mb-2 border-b border-slate-50 pb-1">
                {data[selectedIndex].month.replace("Th", "Tháng")}
              </Text>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-blue-500 text-[11px] font-bold">Điện:</Text>
                <Text className="text-slate-900 text-[11px] font-black">
                  {formatCurrency(data[selectedIndex].electricity)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-emerald-500 text-[11px] font-bold">Nước:</Text>
                <Text className="text-slate-900 text-[11px] font-black">
                  {formatCurrency(data[selectedIndex].water)}
                </Text>
              </View>
            </View>
          )}

        </View>
      </View>

      <View className="flex-row justify-between" style={{ marginLeft: PADDING_LEFT }}>
        {data.map((d, i) => (
          <Text key={i} className={`text-[10px] font-black uppercase ${selectedIndex === i ? "text-white" : "text-slate-500"}`}>
            {d.month}
          </Text>
        ))}
      </View>
    </View>
  );
}
