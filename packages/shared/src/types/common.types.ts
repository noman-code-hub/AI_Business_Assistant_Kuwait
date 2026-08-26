export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export type SoftDelete = {
  deletedAt?: string | null;
};

export type Id = string;

export type MoneyKwd = {
  amount: number;
  currency: "KWD";
};
