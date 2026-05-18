import { useEffect, useState } from "react";

export type BookingTerm = {
  id: string;
  content: string;
};

const MOCK_TERMS: BookingTerm[] = [
  { id: "1", content: "Sinh viên cam kết ở ít nhất 01 học kỳ (5 tháng)." },
  { id: "2", content: "Tuân thủ giờ giấc và nội quy của ký túc xá." },
  { id: "3", content: "Giữ gìn vệ sinh chung và tài sản trong phòng." },
  { id: "4", content: "Không sử dụng các thiết bị điện gây cháy nổ (bếp ga mini, nồi lẩu điện, bếp từ, máy sấy tóc công suất lớn...)." },
  { id: "5", content: "Thanh toán tiền phòng và các chi phí phát sinh đúng hạn vào ngày 05 hàng tháng." },
  { id: "6", content: "Ký túc xá có quyền đơn phương chấm dứt hợp đồng nếu sinh viên vi phạm nội quy nghiêm trọng." }
];

export function useBookingTerms() {
  const [terms, setTerms] = useState<BookingTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setTimeout(() => {
      if (mounted) {
        setTerms(MOCK_TERMS);
        setLoading(false);
      }
    }, 500);

    return () => {
      mounted = false;
    };
  }, []);

  return { terms, loading };
}
