import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export type PieSlice = { name: string; value: number; color: string };

type Props = { slices: PieSlice[] };

const SIZE = 200;
const R_BIG = 90;
const R_SMALL = 60;
const CX = SIZE / 2;
const CY = SIZE / 2;

function EmptyPie() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 24, gap: 10 }}>
      <View style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: 28, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="pie-chart-outline" size={40} color="#CBD5E1" />
      </View>
      <Text style={{ fontSize: 15, fontWeight: '800', color: '#64748B', marginTop: 8 }}>Chưa có dữ liệu</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', textAlign: 'center', maxWidth: 220 }}>
        Khoảng thời gian này chưa có thông tin thanh toán.
      </Text>
    </View>
  );
}

export function InteractivePieChart({ slices }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const scales = useRef(slices.map(() => new Animated.Value(1))).current;

  if (!slices || slices.length === 0) return <EmptyPie />;

  const handleSlicePress = (i: number) => {
    if (selectedIdx === i) {
      Animated.spring(scales[i], { toValue: 1, useNativeDriver: true, friction: 6 }).start();
      setSelectedIdx(null);
    } else {
      if (selectedIdx !== null) {
        Animated.spring(scales[selectedIdx], { toValue: 1, useNativeDriver: true, friction: 6 }).start();
      }
      Animated.spring(scales[i], { toValue: 1.18, useNativeDriver: true, friction: 5 }).start();
      setSelectedIdx(i);
    }
  };

  const total = slices.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;
  const paths = slices.map((slice) => {
    const angle = (slice.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = CX + R_BIG * Math.cos(startAngle);
    const y1 = CY + R_BIG * Math.sin(startAngle);
    const x2 = CX + R_BIG * Math.cos(endAngle);
    const y2 = CY + R_BIG * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M${CX},${CY} L${x1},${y1} A${R_BIG},${R_BIG},0,${largeArc},1,${x2},${y2} Z`;
    startAngle = endAngle;
    return { path: d };
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {slices.map((slice, i) => (
            <G key={i}>
              <Path
                d={paths[i].path}
                fill={slice.color}
                opacity={selectedIdx !== null && selectedIdx !== i ? 0.45 : 1}
                onPress={() => handleSlicePress(i)}
              />
            </G>
          ))}
          <Path d={`M${CX},${CY - R_SMALL} A${R_SMALL},${R_SMALL},0,1,1,${CX - 0.01},${CY - R_SMALL} Z`} fill="white" />
        </Svg>

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          {selectedIdx !== null ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', fontSize: 22, color: slices[selectedIdx].color }}>{slices[selectedIdx].value}%</Text>
              <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', textAlign: 'center', maxWidth: 80 }}>
                {slices[selectedIdx].name}
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', fontSize: 14, color: '#64748B' }}>Tổng</Text>
              <Text style={{ fontWeight: '900', fontSize: 20, color: '#1E293B' }}>100%</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' }}>
        {slices.map((slice, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleSlicePress(i)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              backgroundColor: selectedIdx === i ? slice.color + '14' : '#F8FAFC',
              borderColor: selectedIdx === i ? slice.color : '#F1F5F9',
            }}
          >
            <View style={{ width: 12, height: 12, borderRadius: 6, marginRight: 12, backgroundColor: slice.color }} />
            <View>
              <Text style={{ fontWeight: '900', color: '#1E293B' }}>{slice.value}%</Text>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700' }}>{slice.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
