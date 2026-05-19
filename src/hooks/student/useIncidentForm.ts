import { useState, useCallback, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useIncidentReport } from "./useIncidentReport";
import { useToast } from "@/components/toast/ToastProvider";
import { getIncidentCategories } from "@/services/incident/incident.api";
import { IncidentCategoryResponse } from "@/services/incident/incident.types";

export function useIncidentForm(roomId: string) {
  const { submitIncident, isLoading } = useIncidentReport();
  const [categories, setCategories] = useState<IncidentCategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);
        const data = await getIncidentCategories();
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      } catch (error) {
        console.error("Failed to load incident categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast({ type: "error", title: "Lỗi", message: "Cần cấp quyền truy cập thư viện ảnh để tải ảnh lên." });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7, 
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  }, [showToast]);

  const removeImage = useCallback((indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const resetForm = useCallback(() => {
    setSelectedCategory(categories[0]?.id || "");
    setDescription("");
    setImages([]);
  }, [categories]);

  const handleSubmit = useCallback(async () => {
    const trimmed = description.trim();
    if (!trimmed) {
      showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập mô tả sự cố." });
      return;
    }
    if (trimmed.length < 10) {
      showToast({ type: "error", title: "Lỗi", message: "Mô tả sự cố phải từ 10 đến 1000 ký tự." });
      return;
    }
    if (trimmed.length > 1000) {
      showToast({ type: "error", title: "Lỗi", message: "Mô tả sự cố không được vượt quá 1000 ký tự." });
      return;
    }
    const success = await submitIncident(roomId, selectedCategory, description, images);
    if (success) {
      resetForm();
    }
  }, [description, roomId, selectedCategory, images, submitIncident, showToast, resetForm]);

  return {
    categories,
    isCategoriesLoading,
    selectedCategory,
    setSelectedCategory,
    description,
    setDescription,
    images,
    handlePickImage,
    removeImage,
    handleSubmit,
    isLoading,
    resetForm,
  };
}
