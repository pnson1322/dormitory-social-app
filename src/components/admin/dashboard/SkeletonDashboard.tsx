import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

type Props = { topInset: number };

export function SkeletonDashboard({ topInset }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View
        style={{
          height: topInset + 100,
          backgroundColor: '#1E40AF',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: topInset + 14,
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ gap: 8 }}>
          <SkeletonBox w={120} h={28} radius={8} />
          <SkeletonBox w={180} h={14} radius={6} />
        </View>
        <SkeletonBox w={110} h={36} radius={20} />
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: -10, gap: 16 }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {[0, 1].map(i => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 32,
                padding: 20,
                gap: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
              }}
            >
              <SkeletonBox w={40} h={40} radius={16} />
              <SkeletonBox w={60} h={10} radius={4} />
              <SkeletonBox w={100} h={20} radius={6} />
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 32,
            padding: 24,
            borderWidth: 1,
            borderColor: '#F1F5F9',
            gap: 12,
          }}
        >
          <SkeletonBox w={120} h={20} radius={6} />
          <SkeletonBox w={180} h={12} radius={4} />
          <SkeletonBox w="100%" h={160} radius={16} />
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 32,
            padding: 24,
            borderWidth: 1,
            borderColor: '#F1F5F9',
            gap: 12,
          }}
        >
          <SkeletonBox w={140} h={20} radius={6} />
          <SkeletonBox w={200} h={12} radius={4} />
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <SkeletonBox w={200} h={200} radius={100} />
          </View>
        </View>
      </View>
    </View>
  );
}
