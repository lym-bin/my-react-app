//src/Order/useAddresses.ts
// 로그인한 사용자의 배송지 목록을 Firesotre(users/{uid}/addresses)에서 불러오고 추가하는 커스텀 훅
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import type { Address } from "../types/address";

export default function useAddresses(uid: string | undefined) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    let ignore = false; // 응답이 오기 전에 페이지를 떠나거나 계정이 바뀌면, 늦게 온 결과는 버림

    async function load(userId: string) {
      try {
        // 추가한 순서대로 정렬해서 가져오기
        const q = query(
          collection(db, "users", userId, "addresses"),
          orderBy("createdAt"),
        );
        const snapshot = await getDocs(q);
        if (ignore) return;
        setAddresses(
          snapshot.docs.map((d) => ({
            id: d.id, // 문서 이름을 그대로 id로 사용
            ...(d.data() as Omit<Address, "id">),
          })),
        );
      } catch (error) {
        console.error("배송지를 불러오지 못했습니다.", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load(uid);
    return () => {
      ignore = true; // cleanup: 이 effect가 끝나는 지점
    };
  }, [uid]);

  // 새 배송지 저장: 서버 저장이 성공한 뒤에 화면 목록에도 추기
  const addAddress = async (newAddress: Address) => {
    if (!uid) return;
    const { id, ...fields } = newAddress; // id는 문서 이름으로 쓰고, 나머지 항목만 저장
    await setDoc(doc(db, "users", uid, "addresses", id), {
      ...fields,
      createdAt: serverTimestamp(), // 시간은 서버 시계 기준으로 기록
    });
    setAddresses((prev) => [...prev, newAddress]);
  };
  return { addresses, isLoading, addAddress };
}
