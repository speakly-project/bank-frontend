//models front
export interface BankTransactionInterface {
  transaction_type: string;
  transaction_origin: string;
  credit_card?: string;
  date: string;
  amount: number;
  description?: string;
}

export interface BankCreditCardInterface {
  number: string;
  expiration_date: string;
  cvv: string;
  full_name?: string;
}

export interface BankAccountInterface {
  iban: string;
  balance: number;
  credit_cards?: BankCreditCardInterface[];
  transactions?: BankTransactionInterface[];
}

export interface BankUserInterface {
  id: string;
  login: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  dni: string;
  api_key: string;
  accounts?: BankAccountInterface[];
}

//models back

export interface AuthorizationDto {
  username: string;
  apiKey: string;
}

export interface OriginDto {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  fullName: string;
}

export interface DestinationDto {
  IBAN: string;
}

export interface PaymentDto {
  amount: number;
  description: string;
}

export interface CardPaymentRequest {
  authorization: AuthorizationDto;
  origin: OriginDto;
  destination: DestinationDto;
  payment: PaymentDto;
  createdAt?: string;
}

export interface CardPaymentResponse {
  origin: OriginDto;
  destination: DestinationDto;
  payment: PaymentDto;
  status: string;
}

export interface AccountSummaryResponse {
  id: number;
  iban: string;
  balance: number;
}

export interface CreditCardResponse {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  fullName: string;
}

export interface BankTransactionResponse {
  id: number;
  origin: string;
  type: string;
  originCardNumber: string | null;
  transactionDate: string;
  amount: number;
  description: string;
}

export interface AccountDetailsResponse {
  id: number;
  iban: string;
  balance: number;
  cards: CreditCardResponse[];
  transactions: BankTransactionResponse[];
}
