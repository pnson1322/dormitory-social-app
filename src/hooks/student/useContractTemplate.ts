import { contractApi } from "@/services/contract/contract.api";
import { ContractTemplate } from "@/services/contract/contract.types";
import { useEffect, useState } from "react";

export function useContractTemplate(templateId?: string) {
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return;
      
      try {
        setLoading(true);
        const response = await contractApi.getContractTemplate(templateId);
        if (response.data) {
          setTemplate(response.data);
        }
      } catch (error) {
        setTemplate({
          id: templateId,
          code: "STANDARD_DORM_CONTRACT",
          name: "Hợp đồng thuê phòng Ký túc xá Tiêu chuẩn",
          version: 1,
          content: `**ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG**\nBên A đồng ý cho Bên B thuê phòng tại Ký túc xá với các điều kiện quy định tại hợp đồng này.\n\n**ĐIỀU 2: GIÁ CẢ VÀ PHƯƠNG THỨC THANH TOÁN**\n- Giá thuê phòng được tính theo tháng và có thể thay đổi theo quy định của KTX.\n- Thanh toán từ ngày 1 đến ngày 5 hàng tháng.\n\n**ĐIỀU 3: QUYỀN VÀ NGHĨA VỤ**\n- Tuân thủ nội quy Ký túc xá.\n- Giữ gìn vệ sinh chung, bảo vệ tài sản công cộng.`,
          isActive: true,
          effectiveFrom: "2025-01-01T00:00:00Z",
          effectiveTo: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  return {
    template,
    loading,
  };
}
