// src/components/ErrorBoundary.tsx
// 방어적 설계를 하는 컴포넌트
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 클래스 문법
// 에러 바운더리는 오직 class로만 만들 수 있음(hook으로 만드는 방법X)
// 자식 컴포넌트 트리 어딘가에서 렌더링 중 에러가 나면 하얗게꺠지는 대신
// 대체 화면을 보여준다는 에러 바운더리 기능
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  // 자식 어딘가에서 에러 터지면 리액트가 자동으로 호출(리턴 값이 새 state가 됨)
  // hasError: true << 새로운 state
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // 클래스 컴포넌트 이므로 useEffect 대신
  // 클래스 생명주기 메서드 componentsDidCatch(에러감지) 사용
  componentDidCatch(error: Error, info: ErrorInfo) {
    // 부수효과로 console.error(로깅) 실행
    console.error("예기치 못한 오류가 발생했습니다.", error, info);
  }

  // useState 대신 this.state로 상태 관리
  // 에러감지기능은 클래스로만 가능-> 클래스로 만듬->
  // 클래스는 원래부터(훅 생기기 전 부터) this.state로 상태관리를 해옴
  // 클래스 안에선(나중에 나온) 훅을 애초에 호출할 수 없음
  render() {
    // render() : 클래스형 컴포넌트는 render라는 메서드를 씀
    // 반환은 render()안에서 return
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-navy-950 px-[20px] text-center">
          <span className="mb-[16px] text-[13px] tracking-[0.3em] text-cream/40 uppercase">
            Error
          </span>
          <h1 className="mb-[16px] text-[24px] font-normal text-cream">
            일시적인 오류가 발생했습니다
          </h1>
          <p className="mb-[32px] text-[14px] leading-[1.6] text-cream/60">
            페이지를 새로고침해도 문제가 계속되면 잠시 후 다시 시도해주세요.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center border border-terracotta-500 bg-transparent px-[32px] py-[13px] text-[13px] tracking-[0.1em] text-terracotta-500 uppercase transition-colors hover:bg-terracotta-500 hover:text-navy-950"
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
