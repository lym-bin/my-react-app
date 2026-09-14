// src/context/AuthContext.tsx
// 로그인 정보를 앱 전체가 같이 보는 창고
// Firebase Auth와 리액트 state를 연결하는 다리
// 누가 로그인했는지, isLoading 아직 확인중인지 값 체크를 해주는 파일

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged, // 로그인 상태 바뀔 때마다 알려주는 리스너
  signInWithEmailAndPassword, // 로그인
  createUserWithEmailAndPassword, // 회원가입
  signOut as firebaseSignOut, // 로그아웃 (TOBE: logout이랑 이름 겹쳐서 as로 개명)
  updateProfile, // displaynaName(닉네임) 변경
  EmailAuthProvider, // 재인증용 "증명서" 만드는 도구
  reauthenticateWithCredential, // 현재 비밀번호로 "진짜 본인 맞는지" 재확인
  updatePassword as firebaseUpdatePassword, // 비밀번호 변경(이름 겹쳐서 as로 개명)
  sendPasswordResetEmail, // 비밀번호 재설정 메일 발송
  type User, // Firebase가 쓰는 "로그인한 사용자" 객체의 타입
} from "firebase/auth";
// import 목록을 보고 무슨 파일인지 파악
// type이 붙어있는건 타입스크팁트 전용 값의 type을 가져옴
import { auth } from "../firebase";

// interface: 이 객체는 반드시 이런 모양이어야 한다라는 설계도
interface AuthContextValue {
  isLoggedIn: boolean; // 로그인 됐는지 (true/false)
  isLoading: boolean; // Firebase가 로그인 상태 확인 중인지
  user: User | null; // 로그인한 사용자 객체 (안했으면 null)
  nickname: string | null; // displayName 없으면 email
  // 이메일이랑 비밀번호(문자열)을 받아서 Promise(void) 비동기 작업
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// 빈 상자 생성, 기본 값 undefined = Provider 밖에서 잘못 쓰면 감지 해야함
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// children이라는 props 하나를 받는데 그 안에 화면에 그릴 수 있는 JSX가 들어있다
export function AuthProvider({ children }: { children: ReactNode }) {
  // useState는 [현재값, 값 바꾸는 함수]를 return;
  const [user, setUser] = useState<User | null>(null); // 현재 로그인 사용자
  // firebase한테 지금 로그인 되있는지 안되있는지 isLoading이 true인지 확인
  const [isLoading, setIsLoading] = useState(true);

  // 바닐라 js로 비유하면 이벤트리스너DOM로드처럼 준비되면 한 번 실행
  useEffect(() => {
    // Firebase가 브라우저에 세션을 저장해두기 때문에, 새로고침해도
    // 이 콜백이 실제 로그인 상태를 다시 알려줌.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // 로그인/로그아웃/세션복구 될 때마다 user state 갱신
      setIsLoading(false); // 한 번이라도 확인 끝나면 "로딩 아님"으로
    });
    return unsubscribe; // cleanup: 언마운트 시 리스너 해제
  }, []); // 빈 배열: 마운트시 딱 한번만 리스너 등록

  // async function login(email, password) {과 같음}
  // 로그인 : Firebase 함수를 그대로 호출 만함. user state는 안 건드림
  // (성공하면 위의 onAuthStateChanged 리스너가 알아서 seyUser 해줌)
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 회원가입
  const signup = async (email: string, password: string, nickname?: string) => {
    // 계정 생성 -> 방금 만들어진 유저 정보를 credential에 받음
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    if (nickname) {
      // 닉네임을 같이 넘겼으면, 그 유저의 표시이름(displayName)설정
      await updateProfile(credential.user, { displayName: nickname });
      // 리스너는 "닉네임 변경"까지는 자동으로 안 려줘서 화면 갱신위해 수동으로 새 객체 넣어줌
      setUser({ ...credential.user } as User);
    }
  };
  // 로그아웃: Firebase 함수 호출만, user가 null 되는 것도 리스너가 처리
  const logout = async () => {
    await firebaseSignOut(auth);
  };

  // 비밀번호 재설정 매일 발송 요청
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // 닉네임 변경 (마이페이지, 회원정보수정에서 씀)
  const updateNickname = async (nickname: string) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다"); // 로그인 안 됐으면 에러 던짐
    await updateProfile(auth.currentUser, { displayName: nickname });
    // onAuthStateChanged는 프로필 변경엔 다시 호출되지 않아서
    // 화면 렌더링을 위해 새 겍체 참조로 state 갈아낌
    setUser({ ...auth.currentUser } as User);
  };

  // 비밀번호 변경 (보안 때문에 "재인증" 절차가 필수)
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const current = auth.currentUser;
    if (!current || !current.email) throw new Error("로그인이 필요합니다");
    // 1) "이메일 + 현재 비밀번호"로 증명서(credential)생성
    const credential = EmailAuthProvider.credential(
      // 2) 그 증명서를 Firebase에 제출해서 "진짜 본인 맞는지" 재확인
      current.email,
      currentPassword,
    );
    await reauthenticateWithCredential(current, credential);
    // 3) 통과 했으면 그제서야 진짜 비밀번호 변경
    await firebaseUpdatePassword(current, newPassword);
  };
  // nickname: 함수 아니고 매 렌더링 마다 계산 되는 값
  // "user 있으면 -> displayName 우선, 없으면 email / user 없으면 null"
  const nickname = user ? user.displayName || user.email : null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null, // user가 null이 아니면 true (여기서 계산해서 넣음)
        isLoading,
        user,
        nickname,
        login,
        signup,
        logout,
        resetPassword,
        updateNickname,
        changePassword,
      }}
    >
      {children /* 받은 children을 이 상자로 감싸서 렌더링*/}
    </AuthContext.Provider>
  );
}

// 다른 컴포넌트들이 로그인 정보 쓸 때 호출하는 유일한 창구
export function useAuth() {
  const ctx = useContext(AuthContext); // 상자 열어보기
  if (!ctx) {
    // AuthProvider로 안 감싸진 곳에서 잘못 호출 -> 바로 에러로 알려줌
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
