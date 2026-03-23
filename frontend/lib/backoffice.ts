export type Subscriber = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

export type OrderStatus = "placed" | "processing" | "shipped" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: OrderStatus;
  trackingNumber: string | null;
  adminNotes: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};
