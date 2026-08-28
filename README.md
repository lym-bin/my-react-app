# Objet & B

절제된 실루엣과 미니멀한 디테일을 콘셉트로 한 쇼핑몰 웹사이트입니다.
상품 목록/상세, 장바구니, 주문, 로그인/회원관리까지 실제 이커머스 서비스에 필요한 기능들을 처음부터 끝까지 직접 구현해봤습니다.

배포: https://my-react-app-lym-bin.vercel.app/

## 사용 기술

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- GSAP (스크롤 애니메이션, 인트로 모션)
- React Router
- Firebase (Authentication, Firestore)
- lucide-react

## 기능

- 상품 목록 카테고리/색상/사이즈 필터링, 정렬, 더보기 페이지네이션, 검색
- 상품 상세 페이지 - 색상/사이즈 옵션, 사이즈 가이드, 비슷한 상품/후기 추천
- 장바구니 (옵션별 개별 관리, 수량 조절, 새로고침해도 유지)
- 배송지 등록/선택, 결제수단 선택, 주문 생성 (Firestore 저장)
- 이메일/비밀번호 로그인, 회원가입, 비밀번호 재설정
- 마이페이지 - 주문내역 조회, 최근 본 상품, 닉네임/비밀번호 수정
- 반응형 다크테마 UI, GSAP 스크롤 애니메이션

## 실행 방법

먼저 패키지 설치:

```bash
npm install
```

개발 서버 실행 (localhost:5173):

```bash
npm run dev
```

빌드:

```bash
npm run build
```

## 폴더 구조

```
src/
├── components/layout   # 헤더, 푸터, 로고
├── context              # 로그인, 장바구니 전역 상태
├── pages/Main            # 메인 페이지
├── ProductList          # 상품 목록 / 필터
├── ProductDetail        # 상품 상세
├── Order                 # 주문/결제
├── Login
├── Mypage
└── hooks
```

## 만들면서

원래는 이미지 클릭하면 모달 띄우는 정도로 시작했는데 하다 보니 장바구니, 로그인, 주문 흐름까지 다 붙이게 됐습니다. Firebase로 인증/DB 연동해보면서 실제 서비스처럼 상태 관리하는 게 생각보다 까다로웠고, 특히 옵션(색상/사이즈)별로 장바구니 아이템을 분리해서 관리하는 부분이 고민이 많았습니다.

---
persie24@naver.com
