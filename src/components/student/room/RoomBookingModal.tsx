import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { RoomDetail } from "@/services/room/room.types";
import { formatCurrency } from "@/utils/room";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
  Animated,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  room: RoomDetail;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function RoomBookingModal({
  visible,
  room,
  loading,
  onClose,
  onConfirm,
}: Props) {
  const [agreed, setAgreed] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 9,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender && !visible) return null;

  const handleClose = () => {
    onClose();
  };

  const deposit = room.basePrice; 
  const totalInitial = room.basePrice + deposit;

  return (
    <Modal visible={shouldRender} transparent animationType="none">
      <View className="flex-1 justify-end">
        <Animated.View 
          className="absolute inset-0 bg-black/50" 
          style={{ opacity: backdropAnim }}
        >
          <Pressable className="flex-1" onPress={handleClose} />
        </Animated.View>
        
        <Animated.View 
          className="bg-white rounded-t-[32px] px-6 pb-10 pt-6"
          style={{ 
            maxHeight: "90%",
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <Text className="text-[22px] font-extrabold text-slate-900 mb-6">
            Xác nhận đăng ký
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View 
              className="rounded-2xl p-4 mb-6"
              style={{ backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: Colors.border }}
            >
              <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Thông tin phòng
              </Text>
              <Text className="text-[18px] font-bold text-slate-900">
                Phòng {room.name}
              </Text>
              <Text className="text-[14px] text-slate-500 mt-1">
                {room.buildingName} • Tầng {room.floor}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Chi phí dự kiến
              </Text>
              
              <View className="gap-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[15px] text-slate-600">Giá thuê / tháng</Text>
                  <Text className="text-[15px] font-bold text-slate-900">{formatCurrency(room.basePrice)}</Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-[15px] text-slate-600">Tiền đặt cọc (1 tháng)</Text>
                  <Text className="text-[15px] font-bold text-slate-900">{formatCurrency(deposit)}</Text>
                </View>

                <View className="h-[1px] bg-slate-100 my-1" />

                <View className="flex-row justify-between items-center">
                  <Text className="text-[16px] font-bold text-slate-900">Tổng cộng ban đầu</Text>
                  <Text className="text-[18px] font-black text-primary">{formatCurrency(totalInitial)}</Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Điều khoản & Nội quy
              </Text>
              <View 
                className="rounded-2xl p-4 bg-slate-50"
                style={{ borderWidth: 1, borderColor: Colors.border }}
              >
                <Text className="text-[14px] leading-6 text-slate-600">
                  1. Sinh viên cam kết ở ít nhất 01 học kỳ (5 tháng).{"\n"}
                  2. Tuân thủ giờ giấc và nội quy của ký túc xá.{"\n"}
                  3. Giữ gìn vệ sinh chung và tài sản trong phòng.{"\n"}
                  4. Không sử dụng các thiết bị điện gây cháy nổ.{"\n"}
                  5. Thanh toán tiền phòng đúng hạn vào ngày 05 hàng tháng.
                </Text>
              </View>
            </View>

            <Pressable 
              onPress={() => setAgreed(!agreed)}
              className="flex-row items-center mb-8 gap-3"
            >
              <Switch
                value={agreed}
                onValueChange={setAgreed}
                trackColor={{ false: "#CBD5E1", true: Colors.primaryLight }}
                thumbColor={agreed ? Colors.primary : "#F8FAFC"}
              />
              <Text className="flex-1 text-[14px] font-medium text-slate-700 leading-5">
                Tôi đã đọc và đồng ý với các điều khoản, nội quy đăng ký cư trú tại ký túc xá.
              </Text>
            </Pressable>
          </ScrollView>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 h-[52px] items-center justify-center rounded-2xl bg-slate-100"
            >
              <Text className="text-[16px] font-bold text-slate-600">Hủy</Text>
            </Pressable>
            
            <View className="flex-[2]">
              <AppButton
                title="Xác nhận đăng ký"
                onPress={onConfirm}
                loading={loading}
                disabled={!agreed || loading}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
