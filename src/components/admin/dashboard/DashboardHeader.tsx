import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

type Props = {
  filterLabel: string;
  onOpenFilter: () => void;
  insets: EdgeInsets;
};

export function DashboardHeader({ filterLabel, onOpenFilter, insets }: Props) {
  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB']}
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        paddingBottom: 60,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 30, fontWeight: '900', color: 'white' }}>Thống kê</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '700', marginTop: 4 }}>
            Dữ liệu tài chính hệ thống
          </Text>
        </View>
        <TouchableOpacity
          onPress={onOpenFilter}
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="options-outline" size={18} color="white" />
          <Text style={{ fontWeight: '900', color: 'white' }}>{filterLabel}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
