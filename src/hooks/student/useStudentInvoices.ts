import { useEffect, useMemo, useState } from "react";

export type InvoiceStatus = "UNPAID" | "PAID";

export type InvoiceBreakdown = {
  label: string;
  amount: number;
};

export type Invoice = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidDate?: string;
  type: string;
  breakdown?: InvoiceBreakdown[];
};

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-001",
    title: "Hóa đơn tháng 05/2026",
    amount: 1500000,
    dueDate: "2026-05-15",
    status: "UNPAID",
    type: "Phòng & Dịch vụ",
    breakdown: [
      { label: "Tiền phòng", amount: 1200000 },
      { label: "Tiền điện (50kWh)", amount: 200000 },
      { label: "Tiền nước (10m3)", amount: 100000 },
    ],
  },
  {
    id: "INV-002",
    title: "Hóa đơn tháng 04/2026",
    amount: 1450000,
    dueDate: "2026-04-15",
    status: "PAID",
    paidDate: "2026-04-10",
    type: "Phòng & Dịch vụ",
    breakdown: [
      { label: "Tiền phòng", amount: 1200000 },
      { label: "Tiền điện (35kWh)", amount: 150000 },
      { label: "Tiền nước (10m3)", amount: 100000 },
    ],
  },
  {
    id: "INV-003",
    title: "Hóa đơn tháng 03/2026",
    amount: 1520000,
    dueDate: "2026-03-15",
    status: "PAID",
    paidDate: "2026-03-12",
    type: "Phòng & Dịch vụ",
    breakdown: [
      { label: "Tiền phòng", amount: 1200000 },
      { label: "Tiền điện (55kWh)", amount: 220000 },
      { label: "Tiền nước (10m3)", amount: 100000 },
    ],
  },
];

export function useStudentInvoices() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>("UNPAID");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((inv) => inv.status === activeTab);
  }, [activeTab]);

  const loadInvoices = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    loadInvoices();
  }, [activeTab]);

  const onRefresh = () => {
    loadInvoices(true);
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return {
    activeTab,
    setActiveTab,
    invoices: filteredInvoices,
    loading,
    refreshing,
    onRefresh,
    isOverdue,
  };
}
