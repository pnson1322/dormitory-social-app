import { useEffect, useState } from "react";
import { contractApi } from "@/services/contract/contract.api";

export type BookingTerm = {
  id: string;
  content: string;
};

const FALLBACK_TERMS: BookingTerm[] = [
  { id: "1", content: "Sinh viên cam kết ở ít nhất 01 học kỳ (5 tháng)." },
  { id: "2", content: "Tuân thủ giờ giấc và nội quy của ký túc xá." },
  { id: "3", content: "Giữ gìn vệ sinh chung và tài sản trong phòng." },
  { id: "4", content: "Không sử dụng các thiết bị điện gây cháy nổ (bếp ga mini, nồi lẩu điện, bếp từ, máy sấy tóc công suất lớn...)." },
  { id: "5", content: "Thanh toán tiền phòng và các chi phí phát sinh đúng hạn vào ngày 05 hàng tháng." },
  { id: "6", content: "Ký túc xá có quyền đơn phương chấm dứt hợp đồng nếu sinh viên vi phạm nội quy nghiêm trọng." }
];

export function useBookingTerms(roomTypeId?: string) {
  const [terms, setTerms] = useState<BookingTerm[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTerms = async () => {
      if (!roomTypeId) {
        setTerms(FALLBACK_TERMS);
        return;
      }

      try {
        setLoading(true);
        const response = await contractApi.getRoomTypeContractTemplate(roomTypeId);
        if (response.data?.content) {
          const lines = response.data.content
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith("#"));

          if (lines.length > 0) {
            setTerms(
              lines.map((line, idx) => ({
                id: String(idx + 1),
                content: line.replace(/^[\*\-\d\.\s\•\-\>\▪\-\◦]+/, ""),
              }))
            );
          } else {
            setTerms([{ id: "1", content: response.data.content }]);
          }
        } else {
          setTerms(FALLBACK_TERMS);
        }
      } catch (err) {
        console.log("Error loading room type contract template, using fallbacks:", err);
        setTerms(FALLBACK_TERMS);
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, [roomTypeId]);

  return { terms, loading };
}
