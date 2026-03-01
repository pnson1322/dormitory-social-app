import { shake } from "@/utils/shake";
import { isValidEmail } from "@/utils/validators";
import { useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

type LoginTouched = {
  email: boolean;
  password: boolean;
};

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<LoginTouched>({
    email: false,
    password: false,
  });

  const shakeX = useRef(new Animated.Value(0)).current;

  const emailTrim = email.trim();

  const emailErr: string | null = !touched.email
    ? null
    : !emailTrim
      ? "Vui lòng nhập email."
      : !isValidEmail(emailTrim)
        ? "Email không đúng định dạng."
        : null;

  const passwordErr: string | null = !touched.password
    ? null
    : !password
      ? "Vui lòng nhập mật khẩu."
      : password.length < 8
        ? "Mật khẩu tối thiểu 8 ký tự."
        : null;

  const isFormValid = useMemo(() => {
    return isValidEmail(emailTrim) && password.length >= 8;
  }, [emailTrim, password]);

  function markAllTouched() {
    setTouched({
      email: true,
      password: true,
    });
  }

  async function submit(opts?: {
    onSuccess?: () => void;
    onError?: (message?: string) => void;
    simulateFail?: boolean;
  }) {
    markAllTouched();

    const invalid =
      !emailTrim ||
      !isValidEmail(emailTrim) ||
      !password ||
      password.length < 8;

    if (invalid) {
      shake(shakeX);
      opts?.onError?.("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 850));

      if (opts?.simulateFail) {
        opts?.onError?.("Email hoặc mật khẩu không đúng.");
        return;
      }

      opts?.onSuccess?.();
    } catch {
      opts?.onError?.("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    password,

    showPassword,
    loading,
    touched,

    emailErr,
    passwordErr,

    isFormValid,
    shakeX,

    setEmail,
    setPassword,
    setShowPassword,
    setTouched,

    submit,
  };
}
