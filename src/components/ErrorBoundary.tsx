// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("예기치 못한 오류가 발생했습니다.", error, info);
  }

  render() {
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
