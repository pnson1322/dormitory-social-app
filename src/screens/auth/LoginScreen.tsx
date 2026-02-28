import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { KeyboardDismiss } from "@/components/KeyboardDismiss";
import { ScreenGradient } from "@/components/ScreenGradient";
import { useLogin } from "@/hooks/auth/useLogin";
import { Link, useRouter } from "expo-router";
import { Animated, Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const {
    email,
    password,
    showPassword,
    loading,
    emailErr,
    passwordErr,
    isFormValid,
    shakeX,
    setEmail,
    setPassword,
    setShowPassword,
    setTouched,
    submit,
  } = useLogin();

  return (
    <KeyboardDismiss>
      <ScreenGradient>
        <Animated.View
          className="rounded-3xl bg-white px-5 py-6 shadow-lg"
          style={{ transform: [{ translateX: shakeX }] }}
        >
          <Text className="text-2xl font-extrabold text-slate-900">
            Đăng nhập
          </Text>
          <Text className="mt-1 text-slate-500 text-base">
            Chào mừng bạn quay lại 👋
          </Text>

          <View className="mt-5 gap-4">
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
              returnKeyType="done"
            />
          </View>

          <Pressable onPress={() => {}} className="mt-4 self-end" hitSlop={12}>
            <Text className="text-primaryLight font-extrabold text-base">
              Quên mật khẩu?
            </Text>
          </Pressable>

          <View className="mt-5">
            <AppButton
              title="Đăng nhập"
              loading={loading}
              disabled={!isFormValid || loading}
              onPress={() =>
                submit(() => {
                  router.replace("/");
                })
              }
            />
          </View>

          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-slate-600 text-base">Chưa có tài khoản?</Text>
            <Link
              className="text-primary font-extrabold text-base"
              href="/(auth)/register"
            >
              Đăng ký
            </Link>
          </View>
        </Animated.View>
      </ScreenGradient>
    </KeyboardDismiss>
  );
}
