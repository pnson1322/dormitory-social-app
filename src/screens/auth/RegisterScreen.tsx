import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { KeyboardDismiss } from "@/components/KeyboardDismiss";
import { ScreenGradient } from "@/components/ScreenGradient";
import { useRegister } from "@/hooks/auth/useRegister";
import { Link, useRouter } from "expo-router";
import { Animated, Text, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const {
    fullName,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirm,
    loading,
    nameErr,
    emailErr,
    passwordErr,
    confirmErr,
    isFormValid,
    shakeX,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirm,
    setTouched,
    submit,
  } = useRegister();

  return (
    <KeyboardDismiss>
      <ScreenGradient>
        <Animated.View
          className="rounded-3xl bg-white px-5 py-6 shadow-lg"
          style={{ transform: [{ translateX: shakeX }] }}
        >
          <Text className="text-2xl font-extrabold text-slate-900">
            Đăng ký
          </Text>
          <Text className="mt-1 text-slate-500 text-base">
            Tạo tài khoản để bắt đầu ✨
          </Text>

          <View className="mt-5 gap-4">
            <AppInput
              label="Họ và tên"
              placeholder="Nguyễn Văn An"
              value={fullName}
              onChangeText={setFullName}
              error={nameErr}
              onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
              returnKeyType="next"
            />

            <AppInput
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailErr}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              returnKeyType="next"
            />

            <AppInput
              label="Mật khẩu"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePasswordVisible={() => setShowPassword((v) => !v)}
              error={passwordErr}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              returnKeyType="next"
            />

            <AppInput
              label="Nhập lại mật khẩu"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              showPasswordToggle
              isPasswordVisible={showConfirm}
              onTogglePasswordVisible={() => setShowConfirm((v) => !v)}
              error={confirmErr}
              onBlur={() =>
                setTouched((p) => ({ ...p, confirmPassword: true }))
              }
              returnKeyType="done"
            />
          </View>

          <View className="mt-6">
            <AppButton
              title="Tạo tài khoản"
              loading={loading}
              disabled={!isFormValid || loading}
              onPress={() =>
                submit(() => {
                  router.replace("/(auth)/login");
                })
              }
            />
          </View>

          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-slate-600 text-base">Đã có tài khoản?</Text>
            <Link
              className="text-primary font-extrabold text-base"
              href="/(auth)/login"
            >
              Đăng nhập
            </Link>
          </View>
        </Animated.View>
      </ScreenGradient>
    </KeyboardDismiss>
  );
}
