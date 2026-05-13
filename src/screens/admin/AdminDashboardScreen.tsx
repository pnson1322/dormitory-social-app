import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { FilterModal } from '@/components/admin/dashboard/FilterModal';
import { InvoiceAnalysis } from '@/components/admin/dashboard/InvoiceAnalysis';
import { InteractivePieChart, PieSlice } from '@/components/admin/dashboard/InteractivePieChart';
import { ChartDataPoint, RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { SkeletonDashboard } from '@/components/admin/dashboard/SkeletonDashboard';
import { StatCards } from '@/components/admin/dashboard/StatCards';
import { useAdminFinance } from '@/hooks/admin/useAdminFinance';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { loading, stats, filter, setFilter, error, refresh } = useAdminFinance();
  const [filterVisible, setFilterVisible] = useState(false);

  const filterLabel = useMemo(() => {
    if (filter.type === 'MONTH') return `Tháng ${filter.month}/${filter.year}`;
    if (filter.type === 'QUARTER') return `Quý ${filter.month}/${filter.year}`;
    return `Năm ${filter.year}`;
  }, [filter]);

  const revenuePoints: ChartDataPoint[] = useMemo(() => {
    if (!stats) return [];
    return stats.revenueChart.labels.map((label, i) => ({
      label,
      value: stats.revenueChart.datasets[0].data[i],
    }));
  }, [stats]);

  const pieSlices: PieSlice[] = useMemo(() => {
    if (!stats) return [];
    return stats.debtChart.map((item, i) => ({
      name: item.name,
      value: item.population,
      color: i === 0 ? '#3B82F6' : '#F87171',
    }));
  }, [stats]);

  if (loading && !stats) {
    return <SkeletonDashboard topInset={insets.top} />;
  }

  if (error && !stats) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 40 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Ionicons name="cloud-offline-outline" size={40} color="#EF4444" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 8 }}>Không tải được dữ liệu</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>{error}</Text>
        <TouchableOpacity
          onPress={refresh}
          style={{ backgroundColor: '#2563EB', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Ionicons name="refresh-outline" size={20} color="white" />
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <DashboardHeader filterLabel={filterLabel} onOpenFilter={() => setFilterVisible(true)} insets={insets} />

      <ScrollView
        style={{ flex: 1, marginTop: -10 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="white" />}
      >
        {loading && stats && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 80 }} pointerEvents="none">
            <View style={{ backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={{ fontWeight: '700', fontSize: 14, color: '#1E293B' }}>Đang tải...</Text>
            </View>
          </View>
        )}

        <StatCards totalRevenue={stats?.totalRevenue ?? 0} totalDebt={stats?.totalDebt ?? 0} />

        <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 32, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 4 }}>Biến động</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700', marginBottom: 24 }}>Triệu VNĐ — Vuốt để xem số liệu</Text>
          <RevenueChart data={revenuePoints} />
        </View>

        <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 32, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 16 }}>Tỷ lệ thanh toán</Text>
          <InteractivePieChart slices={pieSlices} />
        </View>

        <InvoiceAnalysis paidInvoices={stats?.paidInvoices ?? 0} pendingInvoices={stats?.pendingInvoices ?? 0} />
      </ScrollView>

      <FilterModal
        visible={filterVisible}
        initialFilter={filter}
        onClose={() => setFilterVisible(false)}
        onApply={(f) => { setFilter(f); setFilterVisible(false); }}
      />
    </View>
  );
}
