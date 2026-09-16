import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
// typescript-eslint(TS 문법을 읽는 파서+규칙 모음)는 TS 7을 아직 지원 안 해서(하드 에러)
// 설치하지 않음 (아래 TODO 참고). --legacy-peer-deps로 억지 설치했다가
// Vercel 배포가 ERESOLVE 충돌로 실패해서(로컬은 flag로 우회되지만 Vercel의 npm install은 아님) 다시 제거함.

export default defineConfig([
  globalIgnores(["dist"]),
  {
    // TODO: 원래는 ts/tsx도 검사해야 함(실제 컴포넌트가 전부 여기 해당).
    // typescript-eslint가 TS 7을 아직 지원 안 해서(하드 에러) 임시로 js/jsx만.
    // TS 파서 없이 ts/tsx를 그냥 넣으면 "건너뛰기"가 아니라 파싱 에러로 실패함
    // (FormEvent 같은 TS 문법에서 즉시 에러). typescript-eslint가 TS 7 지원하면
    // "typescript-eslint" import 복원 + files에 ts,tsx 추가 + extends에 tseslint.configs.recommended 추가.
    // (https://github.com/typescript-eslint/typescript-eslint/issues/10940)
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
]);
