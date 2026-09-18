// src/main.tsx
// 리액트 앱의 맨 첫 시작점 파일

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

// React가 관리할 영역
// createRoot는 React18부터 생긴 api(그 전엔 ReactDOM.render를 씀)
// root에 대고 호출 하면 안의 컴포넌트 트리들이 Dom으로 그려짐
// !는 TS문법 null일 수도 있지만 내가 보장한다는 의미
// getElementById 타입상 HTMLElement | null을 반환하는데 div가 있다는걸
// 아니까 강제로 null 가능성을 지움
createRoot(document.getElementById("root")!).render(
  // StrictMode: 개발 모드 전용 감시자 컴포넌트를 일부로 두 번씩 실행 시 켜서 버그잡아줌
  // ErrorBoundary: <App /> 어디서든 렌더링 중 에러가 터지면 컴포넌트 대신 fallback 화면을 보여줌
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
