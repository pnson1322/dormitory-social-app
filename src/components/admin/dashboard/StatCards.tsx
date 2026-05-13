import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { formatCurrency } from '@/utils/room';

type Props = {
  totalRevenue: number;
  totalDebt: number;
};

export function StatCards({ totalRevenue, totalDebt }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: '#F1F5F9',
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#EFF6FF',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name="stats-chart" size={22} color="#2563EB" />
        </View>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>
          Doanh thu
        </Text>
        <Text
          style={{ color: '#1E293B', fontWeight: '900', marginTop: 4, fontSize: 15 }}
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.6}
        >
          {totalRevenue ? formatCurrency(totalRevenue) : '—'}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: '#F1F5F9',
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#FEF2F2',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name="alert-circle" size={22} color="#EF4444" />
        </View>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>
          Nợ đọng
        </Text>
        <Text
          style={{ color: '#1E293B', fontWeight: '900', marginTop: 4, fontSize: 15 }}
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.6}
        >
          {totalDebt ? formatCurrency(totalDebt) : '—'}
        </Text>
      </View>
    </View>
  );
}
