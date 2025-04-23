export interface Addition {
  id: number;
  name: string;
  price_cents: number;
}

export interface Subtraction {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  image_url: string;
  available: boolean;
  additions?: Addition[];
  subtractions?: Subtraction[];
}

export interface CartAddition {
  id: number;
  name: string;
  price: number; // in cents, converted from price_cents
}

export interface CartSubtraction {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number; // in cents
  additions: CartAddition[];
  subtractions: CartSubtraction[];
  note: string;
  uniqueId: string;
}