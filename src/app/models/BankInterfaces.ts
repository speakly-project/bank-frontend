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
