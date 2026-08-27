// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  nickname: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase가 브라우저에 세션을 저장해두기 때문에, 새로고침해도
    // 이 콜백이 실제 로그인 상태를 다시 알려줍니다.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const updateNickname = async (nickname: string) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다");
    await updateProfile(auth.currentUser, { displayName: nickname });
    // onAuthStateChanged는 프로필 변경엔 다시 호출되지 않아서
    // 화면 렌더링을 위해 새 겍체 참조로 state 갈아낌
    setUser({ ...auth.currentUser } as User);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const current = auth.currentUser;
    if (!current || !current.email) throw new Error("로그인이 필요합니다");
    const credential = EmailAuthProvider.credential(
      current.email,
      currentPassword,
    );
    await reauthenticateWithCredential(current, credential);
    await firebaseUpdatePassword(current, newPassword);
  };
  // TODO: 회원가입 시 표시 이름(displayName)을 따로 받으면 이메일 대신 그걸 보여줄 수 있습니다.
  const nickname = user ? user.displayName || user.email : null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null,
        isLoading,
        user,
        nickname,
        login,
        signup,
        logout,
        updateNickname,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
