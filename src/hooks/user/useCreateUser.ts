import { getApiErrorMessage } from "@/services/apiError";
import { createUser, UserRole } from "@/services/user.api";
import { useMemo, useState } from "react";

type TouchedState = {
  fullName: boolean;
  email: boolean;
  password: boolean;
  role: boolean;
};

const DEFAULT_TOUCHED: TouchedState = {
  fullName: false,
  email: false,
  password: false,
  role: false,
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function useCreateUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedState>(DEFAULT_TOUCHED);

  const fullNameTrim = fullName.trim();
  const emailTrim = email.trim();

  const fullNameErr = !touched.fullName
    ? null
    : !fullNameTrim
      ? "Vui lòng nhập họ và tên."
      : fullNameTrim.length < 2
        ? "Họ tên tối thiểu 2 ký tự."
        : null;

  const emailErr = !touched.email
    ? null
    : !emailTrim
      ? "Vui lòng nhập email."
      : !isValidEmail(emailTrim)
        ? "Email không đúng định dạng."
        : null;

  const passwordErr = !touched.password
    ? null
    : !password
      ? "Vui lòng nhập mật khẩu."
      : password.length < 8
        ? "Mật khẩu tối thiểu 8 ký tự."
        : null;

  const isFormValid = useMemo(() => {
    return (
      fullNameTrim.length >= 2 &&
      isValidEmail(emailTrim) &&
      password.length >= 8 &&
      !!role
    );
  }, [fullNameTrim, emailTrim, password, role]);

  function markAllTouched() {
    setTouched({
      fullName: true,
      email: true,
      password: true,
      role: true,
    });
  }

  function reset() {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setTouched(DEFAULT_TOUCHED);
  }

  async function submit(opts?: {
    onSuccess?: () => void;
    onError?: (message: string) => void;
  }) {
    markAllTouched();

    if (!isFormValid) {
      opts?.onError?.("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    try {
      setLoading(true);

      await createUser({
        fullName: fullNameTrim,
        email: emailTrim,
        password,
        role,
      });

      opts?.onSuccess?.();
    } catch (err) {
      opts?.onError?.(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    fullName,
    email,
    password,
    role,
    loading,
    fullNameErr,
    emailErr,
    passwordErr,
    isFormValid,
    setFullName,
    setEmail,
    setPassword,
    setRole,
    setTouched,
    submit,
    reset,
  };
}
