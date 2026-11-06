// api/recommend.ts
// 서버: 상품 ID를 받아 원본데이터(PRODUCTS)에서 찾고, AI 추천 받음
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../src/ProductList/ProductsData.js";
import { filterRecommendations } from "../src/utils/filterRecommendations.js";

interface RecommendBody {
  productId: number; // 브라우저가 보내는 것
}

export async function POST(request: Request) {
  const { productId } = (await request.json()) as RecommendBody;

  // 원본에서 찾기
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return Response.json(
      { message: "없는 상품 ID입니다. 정보가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  // 후보: 지금 상품과 다른 카테고리만 (AI에게 줄 목록)
  const candidates = PRODUCTS.filter((p) => p.category !== product.category);

  // AI에게 줄 후보 목록을 글로 만들기 (한 줄에 상품 하나)
  const candidateText = candidates
    .map((p) => `${p.id}: ${p.name} (${p.category})`)
    .join("\n");

  // AI에게 보낼 지시서
  const prompt = `
너는 이 쇼핑몰의 패션 코디네이터다.

지금 보고 있는 상품: ${product.name} (${product.category})

추천 후보 (이 목록에서만 골라야 함):
${candidateText}

규칙:
1. 후보 목록에서 3개를 추천한다.
2. 후보의 카테고리마다 1개씩 고른다.
3. 후보에 없는 ID를 만들어 내지 않는다.
4. 각 추천마다 지금 상품과 어울리는 이유를 10자 이내로 쓴다.
`;

  // 서버 환경변수에서 키 꺼내기
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { message: "서버 설정이 잘못됐어요" },
      { status: 500 },
    );
  }
  const ai = new GoogleGenAI({ apiKey });

  // Gemini 호출 (실패하면 throw -> catch에서 처리)
  let text: string | undefined;
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: prompt,
      // 답을 이 모양의 JSON으로만 받기
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              maxItems: 3,
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  reason: { type: "string" },
                },
                required: ["id", "reason"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });
    text = interaction.output_text;
  } catch (error) {
    // 한도 초과: SDK 에러에 status 숫자가 들어 있음 (RateLimitError는 공개 안 돼서 숫자로 구분)
    if (error instanceof Error && "status" in error && error.status === 429) {
      console.error("[recommend] Gemini 한도 초과 (429)");
      return Response.json(
        { message: "Gemini 무료 하루 할당량 초과." },
        { status: 429 },
      );
    }
    // 그 밖의 실패 (네트워크, 잘못된 모델 이름 등)
    console.error("[recommend] Gemini 호출 실패", error);
    return Response.json(
      { message: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 },
    );
  }

  // ① AI 답(글자)을 객체로 바꾸기
  if (!text) {
    return Response.json(
      { message: "텍스트가 비어있는 상태입니다." },
      { status: 502 },
    );
  }

  // 모양은 아직 믿지 않음 → 안의 값은 unknown(모름)으로 둠
  let parsed: { recommendations?: { id?: unknown; reason?: unknown }[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    return Response.json(
      { message: "파싱한 데이터가 올바르지 않아요." },
      { status: 502 },
    );
  }

  const results = filterRecommendations(
    parsed.recommendations ?? [],
    candidates,
  );

  return Response.json({ recommendations: results });
}
