import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { KeyboardScreen } from "@/components/KeyboardScreen";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { BioField } from "@/components/profile/BioField";
import { DateField } from "@/components/profile/DateField";
import { EditProfileHeader } from "@/components/profile/EditProfileHeader";
import { FormSection } from "@/components/profile/FormSection";
import { SelectField } from "@/components/profile/SelectField";
import { Colors } from "@/constants/colors";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { ProfileData } from "@/services/profile.api";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

type Props = {
  profile: ProfileData;
  onBack: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
};

export function EditProfileForm({ profile, onBack, onSaved, onError }: Props) {
  const form = useUpdateProfile(profile);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = useMemo(
    () => [
      { label: "Nam", value: "male" as const },
      { label: "Nữ", value: "female" as const },
      { label: "Khác", value: "other" as const },
    ],
    [],
  );

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      onError("Bạn cần cấp quyền truy cập thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    form.setLocalAvatarUri(asset.uri);
  }

  async function handleSubmit() {
    await form.submit({
      onSuccess: () => {
        onSaved();
      },
      onError: (message) => {
        onError(message);
      },
    });
  }

  return (
    <View className="flex-1 bg-background">
      <KeyboardScreen>
        <EditProfileHeader onBack={onBack} />

        <View className="-mt-4 flex-1 px-5 pb-8">
          <View className="items-center rounded-t-[28px] bg-background pt-2">
            <AvatarPicker
              imageUri={form.previewAvatarUri}
              onPress={() => void handlePickAvatar()}
            />
          </View>

          <View className="mt-8 gap-6">
            <FormSection title="Thông tin cá nhân">
              <AppInput
                label="Họ và tên"
                value={form.fullName}
                onChangeText={form.setFullName}
                placeholder="Nhập họ và tên"
                error={form.fullNameErr}
                autoCapitalize="words"
                onBlur={() =>
                  form.setTouched((prev) => ({ ...prev, fullName: true }))
                }
              />

              <View className="gap-2">
                <Text className="font-extrabold uppercase text-textSecondary">
                  Email
                </Text>

                <View
                  className="h-[52px] flex-row items-center rounded-2xl bg-slate-100 px-4"
                  style={{ borderWidth: 1, borderColor: Colors.border }}
                >
                  <Text className="flex-1 text-[15px] text-textSecondary">
                    {form.email}
                  </Text>
                </View>

                <Text className="text-sm text-textSecondary">
                  Liên hệ quản trị viên nếu bạn cần thay đổi email
                </Text>
              </View>

              <AppInput
                label="Số điện thoại"
                value={form.phoneNumber}
                onChangeText={form.setPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                error={form.phoneErr}
                onBlur={() =>
                  form.setTouched((prev) => ({ ...prev, phoneNumber: true }))
                }
              />
            </FormSection>

            <FormSection title="Nhân khẩu học">
              <SelectField
                label="Giới tính"
                value={form.gender}
                options={genderOptions}
                onSelect={form.setGender}
              />

              <DateField
                label="Ngày sinh"
                value={form.dateOfBirth}
                error={form.dateErr}
                onPress={() => setShowDatePicker(true)}
              />
            </FormSection>

            <FormSection title="Giới thiệu bản thân">
              <BioField
                label="Tiểu sử"
                value={form.bio}
                onChangeText={form.setBio}
                error={form.bioErr}
                maxLength={200}
              />
            </FormSection>

            <View className="mt-2 gap-4 pb-8">
              <AppButton
                title="Lưu thay đổi"
                onPress={() => void handleSubmit()}
                loading={form.loading}
              />

              <Pressable
                onPress={onBack}
                className="h-[52px] items-center justify-center rounded-2xl bg-surface"
                style={{ borderWidth: 1, borderColor: Colors.border }}
              >
                <Text className="text-[16px] font-extrabold text-textSecondary">
                  Hủy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardScreen>

      {showDatePicker ? (
        <DateTimePicker
          value={
            form.dateOfBirth
              ? new Date(form.dateOfBirth)
              : new Date("2003-01-01")
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            if (Platform.OS !== "ios") {
              setShowDatePicker(false);
            }

            if (!selectedDate) return;

            const year = selectedDate.getFullYear();
            const month = `${selectedDate.getMonth() + 1}`.padStart(2, "0");
            const day = `${selectedDate.getDate()}`.padStart(2, "0");

            form.setDateOfBirth(`${year}-${month}-${day}`);
            form.setTouched((prev) => ({ ...prev, dateOfBirth: true }));
          }}
        />
      ) : null}
    </View>
  );
}
