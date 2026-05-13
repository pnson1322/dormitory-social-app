import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { FilterPeriod } from '@/services/admin/finance.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  visible: boolean;
  initialFilter: FilterPeriod;
  onClose: () => void;
  onApply: (filter: FilterPeriod) => void;
};

const TYPES = ['MONTH', 'QUARTER', 'YEAR'] as const;
const TYPE_LABELS = { MONTH: 'Tháng', QUARTER: 'Quý', YEAR: 'Năm' };
const QUARTER_RANGES = ['T1 – T3', 'T4 – T6', 'T7 – T9', 'T10 – T12'];
const YEARS = [2024, 2025, 2026];

export function FilterModal({ visible, initialFilter, onClose, onApply }: Props) {
  const [tempFilter, setTempFilter] = useState<FilterPeriod>(initialFilter);

  const monthBtnW = (SCREEN_WIDTH - 48 - 16) / 3;
  const quarterBtnW = (SCREEN_WIDTH - 48 - 12) / 2;

  const handleOpen = () => setTempFilter(initialFilter);

  return (
    <Modal visible={visible} transparent animationType="none" onShow={handleOpen}>
      <View style={{ flex: 1 }}>
        <Animated.View entering={FadeIn.duration(200)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <Animated.View
          entering={SlideInDown.duration(300)}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
        >
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{ width: 56, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' }} />
          </View>

          <Text style={{ fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 24, paddingHorizontal: 4 }}>Lọc dữ liệu</Text>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, backgroundColor: '#F1F5F9', borderRadius: 16, padding: 4 }}>
            {TYPES.map(type => {
              const active = tempFilter.type === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setTempFilter({ ...tempFilter, type, month: 1 })}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: active ? 'white' : 'transparent' }}
                >
                  <Text style={{ fontWeight: '800', fontSize: 13, color: active ? '#2563EB' : '#94A3B8' }}>
                    {TYPE_LABELS[type]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {tempFilter.type === 'MONTH' && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, paddingHorizontal: 4 }}>Chọn tháng</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const active = tempFilter.month === i + 1;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setTempFilter({ ...tempFilter, month: i + 1 })}
                      style={{ width: monthBtnW, paddingVertical: 12, borderRadius: 16, alignItems: 'center', backgroundColor: active ? '#2563EB' : '#F1F5F9' }}
                    >
                      <Text style={{ fontWeight: '800', fontSize: 13, color: active ? 'white' : '#475569' }}>Tháng {i + 1}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {tempFilter.type === 'QUARTER' && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, paddingHorizontal: 4 }}>Chọn quý</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {[1, 2, 3, 4].map(q => {
                  const active = tempFilter.month === q;
                  return (
                    <TouchableOpacity
                      key={q}
                      onPress={() => setTempFilter({ ...tempFilter, month: q })}
                      style={{ width: quarterBtnW, paddingVertical: 16, borderRadius: 16, alignItems: 'center', backgroundColor: active ? '#2563EB' : '#F1F5F9' }}
                    >
                      <Text style={{ fontWeight: '800', fontSize: 15, color: active ? 'white' : '#475569' }}>Quý {q}</Text>
                      <Text style={{ fontWeight: '700', fontSize: 11, marginTop: 2, color: active ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}>
                        {QUARTER_RANGES[q - 1]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, paddingHorizontal: 4 }}>Chọn năm</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {YEARS.map(y => {
                const active = tempFilter.year === y;
                return (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setTempFilter({ ...tempFilter, year: y })}
                    style={{ flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center', backgroundColor: active ? '#0F172A' : '#F1F5F9' }}
                  >
                    <Text style={{ fontWeight: '800', fontSize: 15, color: active ? 'white' : '#475569' }}>{y}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onApply(tempFilter)}
            style={{ backgroundColor: '#2563EB', height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>Xác nhận</Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Ionicons name="chevron-down" size={20} color="#CBD5E1" />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
