import { InfoRow } from "@/components/profile/InfoRow";
import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { Colors } from "@/constants/colors";
import { formatDateToDisplay } from "@/utils/date";
import { View } from "react-native";

type Props = {
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
};

export function ContactInfoCard({ email, phoneNumber, dateOfBirth }: Props) {
  return (
    <ProfileSectionCard icon="person-outline" title="Thông tin liên hệ">
      <View className="gap-4">
        <InfoRow
          icon="mail-outline"
          title="Email"
          value={email}
          iconBg="#DBEAFE"
          iconColor={Colors.primaryLight}
        />

        <InfoRow
          icon="call-outline"
          title="Số điện thoại"
          value={phoneNumber || "Chưa cập nhật"}
          iconBg="#CCFBF1"
          iconColor={Colors.accent}
        />

        <InfoRow
          icon="calendar-outline"
          title="Ngày sinh"
          value={formatDateToDisplay(dateOfBirth)}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
      </View>
    </ProfileSectionCard>
  );
}
