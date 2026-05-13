import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING_LEFT = 32;
const CHART_RIGHT_PAD = 16;
const CHART_WIDTH = SCREEN_WIDTH - 40 - 48 - PADDING_LEFT - CHART_RIGHT_PAD;
const CHART_HEIGHT = 160;
const H_PAD = 10;

export type ChartDataPoint = { label: string; value: number };

type Props = { data: ChartDataPoint[] };

function EmptyChart() {
  return (
    <View style={{ height: CHART_HEIGHT + 40, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <Ionicons name="bar-chart-outline" size={32} color="#CBD5E1" />
      </View>
      <Text style={{ fontSize: 15, fontWeight: '800', color: '#64748B' }}>Chưa có dữ liệu</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', textAlign: 'center', maxWidth: 220 }}>
        {'Khoảng thời gian này chưa có số liệu.\nHãy chọn kỳ khác hoặc đợi thêm.'}
      </Text>
    </View>
  );
}

export function RevenueChart({ data }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [data]);

  if (!data || data.length < 2) return <EmptyChart />;

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1) * 1.12;
  const minVal = Math.max(0, Math.min(...values) * 0.85);
  const range = maxVal - minVal || 1;

  const getX = (i: number) => H_PAD + (i / (data.length - 1)) * (CHART_WIDTH - 2 * H_PAD);
  const getY = (v: number) => CHART_HEIGHT - ((v - minVal) / range) * CHART_HEIGHT;
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  const yLabels = [maxVal, minVal + (range * 2 / 3), minVal + (range / 3), minVal];

  const renderLines = () =>
    points.slice(0, -1).map((p1, i) => {
      const p2 = points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: (p1.x + p2.x) / 2 - dist / 2,
            top: (p1.y + p2.y) / 2 - 1.5,
            width: dist,
            height: 3,
            backgroundColor: '#3B82F6',
            borderRadius: 2,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      );
    });

  const handleTouch = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    const clampedX = Math.max(0, Math.min(CHART_WIDTH, x));
    const innerX = Math.max(0, clampedX - H_PAD);
    const innerWidth = Math.max(1, CHART_WIDTH - 2 * H_PAD);
    const idx = Math.max(0, Math.min(data.length - 1, Math.round((innerX / innerWidth) * (data.length - 1))));
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedIndex(idx);
    timerRef.current = setTimeout(() => setSelectedIndex(null), 1500);
  };

  const formatLabel = (label: string) =>
    label.replace(/^W(\d+)$/, 'Tuần $1').replace(/^T(\d+)$/, 'Tháng $1').replace(/^Q(\d+)$/, 'Quý $1');

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ justifyContent: 'space-between', marginRight: 8, height: CHART_HEIGHT }}>
          {yLabels.map((v, i) => (
            <Text key={i} style={{ width: PADDING_LEFT - 8, color: '#94A3B8', fontSize: 9, fontWeight: '700', textAlign: 'right' }}>
              {v >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`}
            </Text>
          ))}
        </View>

        <View
          style={{ height: CHART_HEIGHT, width: CHART_WIDTH, overflow: 'hidden' }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouch}
          onResponderMove={handleTouch}
          onResponderRelease={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setSelectedIndex(null), 1500);
          }}
        >
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' }} pointerEvents="none">
            {yLabels.map((_, i) => (
              <View key={i} style={{ height: 1, width: '100%', backgroundColor: '#F1F5F9' }} />
            ))}
          </View>

          {renderLines()}

          {selectedIndex !== null && (
            <View style={{ position: 'absolute', left: points[selectedIndex].x, top: 0, bottom: 0, width: 1.5, backgroundColor: '#3B82F6', opacity: 0.25 }} />
          )}

          {points.map((p, i) => {
            const size = selectedIndex === i ? 14 : 10;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: p.x - size / 2,
                  top: p.y - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: selectedIndex === i ? '#2563EB' : '#BFDBFE',
                  borderWidth: selectedIndex === i ? 2.5 : 0,
                  borderColor: 'white',
                }}
              />
            );
          })}

          {selectedIndex !== null && (
            <View
              style={{
                position: 'absolute',
                paddingHorizontal: 14,
                paddingVertical: 12,
                left: points[selectedIndex].x > CHART_WIDTH / 2 ? points[selectedIndex].x - 140 : points[selectedIndex].x + 14,
                top: -8,
                width: 126,
                backgroundColor: 'white',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '900', color: '#1E293B', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8, marginBottom: 8 }}>
                {formatLabel(data[selectedIndex].label)}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#3B82F6' }}>Doanh thu</Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#1E293B' }}>{data[selectedIndex].value} Tr</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: 18, width: CHART_WIDTH, marginLeft: PADDING_LEFT, marginTop: 10, position: 'relative' }}>
        {data.map((d, i) => {
          const dotX = H_PAD + (i / (data.length - 1)) * (CHART_WIDTH - 2 * H_PAD);
          return (
            <Text
              key={i}
              style={{
                position: 'absolute',
                left: dotX - 16,
                width: 32,
                textAlign: 'center',
                fontSize: 10,
                fontWeight: '800',
                color: selectedIndex === i ? '#2563EB' : '#94A3B8',
              }}
            >
              {d.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}
