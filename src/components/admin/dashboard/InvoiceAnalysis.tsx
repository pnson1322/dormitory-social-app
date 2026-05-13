import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  paidInvoices: number;
  pendingInvoices: number;
};

function EmptyInvoices() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 20, gap: 8 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#F1F5F9',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Ionicons name="receipt-outline" size={28} color="#CBD5E1" />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B' }}>Chưa có hóa đơn</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', textAlign: 'center', maxWidth: 220 }}>
        Khoảng thời gian này chưa phát sinh hóa đơn.
      </Text>
    </View>
  );
}

export function InvoiceAnalysis({ paidInvoices, pendingInvoices }: Props) {
  const hasData = paidInvoices > 0 || pendingInvoices > 0;

  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 40,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 24 }}>
        Phân tích hóa đơn
      </Text>

      {!hasData ? (
        <EmptyInvoices />
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, backgroundColor: '#EFF6FF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Ionicons name="receipt" size={24} color="#2563EB" />
              </View>
              <View>
                <Text style={{ fontWeight: '900', color: '#1E293B' }}>Đã thu tiền</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700' }}>Hóa đơn hoàn tất</Text>
              </View>
            </View>
            <Text style={{ color: '#2563EB', fontWeight: '900', fontSize: 20 }}>{paidInvoices}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 24 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, backgroundColor: '#FEF2F2', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Ionicons name="time" size={24} color="#EF4444" />
              </View>
              <View>
                <Text style={{ fontWeight: '900', color: '#1E293B' }}>Hóa đơn nợ</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700' }}>Đang chờ thu</Text>
              </View>
            </View>
            <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 20 }}>{pendingInvoices}</Text>
          </View>
        </>
      )}
    </View>
  );
}
