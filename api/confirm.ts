// api/confirm.ts
// 서버: 브라우저 대신 토스에 "이 결제를 승인해 주세요" 라고 요청 하는 곳
// 시크릿 키는 여기(서버)에서만 꺼내 씀 -> 브라우저 코드에는 절대 들어가지 않음
// (금액을 상품 데이터로 다시 계산하는 검증은 다음 단계에서 추가)

interface ConfirmBody {
  paymentKey: string;
  orderId: string;
  amount: number;
}

// POST 요청이 오면 실행되는 함수 (Request/Response는 브라우저 fetch와 같은 웹 표준 객체)
export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = (await request.json()) as ConfirmBody;

  if (!paymentKey || !orderId || !amount) {
    return Response.json({ message: "결제 정보가 부족해요." }, { status: 400 });
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
