import { useToast } from "@/components/toast/ToastProvider";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

interface UseCreatePostFormProps {
  onSubmit: (
    content: string,
    postType: string,
    files: string[],
  ) => Promise<any>;
  onClose: () => void;
}

export function useCreatePostForm({
  onSubmit,
  onClose,
}: UseCreatePostFormProps) {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<string>("General");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast({
        type: "error",
        title: "Quyền truy cập",
        message: "Cần cấp quyền truy cập thư viện để tải ảnh lên.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      showToast({
        type: "error",
        title: "Lỗi nội dung",
        message: "Vui lòng nhập nội dung bài viết.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(content, postType, images);
      if (success) {
        setContent("");
        setImages([]);
        setPostType("General");
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    postType,
    setPostType,
    images,
    isSubmitting,
    handlePickImage,
    handleRemoveImage,
    handlePublish,
  };
}
