// api/confirm.ts
// 서버: 브라우저 대신 토스에 "이 결제를 승인해 주세요" 라고 요청 하는 곳
// 시크릿 키는 여기(서버)에서만 꺼내 씀 -> 브라우저 코드에는 절대 들어가지 않음
// (금액을 상품 데이터로 다시 계산하는 검증은 다음 단계에서 추가)
import { PRODUCTS } from "../src/ProductList/ProductsData";

interface ConfirmBody {
  paymentKey: string;
  orderId: string;
  amount: number;
  items: { productId: number; qty: number }[]; // 가격은 안받고 "무엇을 몇 개"만 받음
}

const MAX_QTY = 20; // TO-BE 묶어서 관리 예정 장바구니(CartContext)의 최대 수량과 같게함.

// 상품 번호와 수량으로 서버가 직접 합계를 계산 (브라우저가 보낸 가격은 믿지 않음)
// 없는 상품이거나 수량이 이상하면 null
function calulateAmount(items: ConfirmBody["items"]): number | null {
  let total = 0;
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const isValidQty =
      Number.isInteger(item.qty) && item.qty >= 1 && item.qty <= MAX_QTY;
    if (!product || !isValidQty) return null;
    total += product.price * item.qty;
  }
  return total;
}

// POST 요청이 오면 실행되는 함수 (Request/Response는 브라우저 fetch와 같은 웹 표준 객체)
export async function POST(request: Request) {
  const { paymentKey, orderId, amount, items } =
    (await request.json()) as ConfirmBody;

  if (!paymentKey || !orderId || !amount) {
    return Response.json({ message: "결제 정보가 부족해요." }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json(
      { message: "주문 상품 정보가 없어요." },
      { status: 400 },
    );
  }

  // 진짜 검증: 서버가 계산한 금액과 결제하려는 금액이 같은지
  const expectedAmount = calulateAmount(items);
  if (expectedAmount === null) {
    return Response.json(
      { message: "주문 상품 정보가 올바르지 않아요. " },
      { status: 400 },
    );
  }
  if (expectedAmount !== amount) {
    // 토스에 승인 요청을 보내지 않음 -> 인증만 된 결제는 10분 뒤 자동으로 사라져서 돈이 안 나감
    return Response.json(
      { message: "결제 금액이 주문 금액과 달라요." },
      { status: 400 },
    );
  }

  // 서버 환경변수에서 시크릿 키 꺼내기 (Vercel 대시보드에 등록한 값)
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      { message: "서버 설정이 잘못됐어요." },
      { status: 500 },
    );
  }

  // 토스 인증 방식: "시크릿키:"를 base64로 인코딩 (끝의 콜론을 빠뜨리면 인증 실패)
  const auth = btoa(`${secretKey}:`);

  // 토스 결제 승인 API 호출 (결제창 인증 후 10분 안에 해야함)
  const tossResponse = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    },
  );
  const result = await tossResponse.json();

  // 토스가 준 결과와 상태 코드를 브라우저에 그대로 전달 (성공 200, 실패 4xx/5xx)
  return Response.json(result, { status: tossResponse.status });
}
