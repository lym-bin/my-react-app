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
createRoot(document.getElementById("root")!).render(
  // StrictMode: 개발 모드 전용 감시자 컴포넌트를 일부로 두 번씩 실행 시 켜서 버그잡아줌
  // ErrorBoundary: <App /> 어디서든 렌더링 중 에러가 터지면 컴포넌트 대신 fallback 화면을 보여줌
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
