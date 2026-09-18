// src/types/address.ts
// 배송지 정보 타입 (AddressModal/OrderPage/OrderSuccessPage가 공유)

export interface Address {
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
}
