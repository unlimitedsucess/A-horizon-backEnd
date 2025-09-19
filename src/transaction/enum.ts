export enum TransactionStatus {
  PENDING = "pending",
  FAILED = "failed",
  COMPLETED = "complete",
}

export enum TransferType {
  WIRE = "wire",
  DOMESTIC = "domestic",
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
}

export enum TransactionDirection {
  CREDIT = "credit",
  DEBIT = "debit",
}
