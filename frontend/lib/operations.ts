import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { type Order, type OrderItem, type OrderStatus, type Subscriber } from "@/lib/backoffice";

type CreateSubscriberInput = {
  email: string;
  source?: string;
};

type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
};

type UpdateOrderInput = {
  status?: OrderStatus;
  trackingNumber?: string | null;
  adminNotes?: string;
};

const subscribersPath = path.join(process.cwd(), "data", "subscribers.json");
const ordersPath = path.join(process.cwd(), "data", "orders.json");

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    return JSON.parse(file) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export async function getSubscribers(): Promise<Subscriber[]> {
  noStore();
  const subscribers = await readJsonFile<Subscriber[]>(subscribersPath, []);
  return subscribers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createSubscriber(input: CreateSubscriberInput): Promise<Subscriber> {
  const email = input.email.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    throw new Error("A valid email is required.");
  }

  const subscribers = await readJsonFile<Subscriber[]>(subscribersPath, []);
  const existing = subscribers.find((subscriber) => subscriber.email === email);

  if (existing) {
    return existing;
  }

  const subscriber: Subscriber = {
    id: `sub_${Date.now()}`,
    email,
    source: input.source?.trim() || "website",
    createdAt: new Date().toISOString(),
  };

  await writeJsonFile(subscribersPath, [subscriber, ...subscribers]);
  return subscriber;
}

export async function getOrders(): Promise<Order[]> {
  noStore();
  const orders = await readJsonFile<Order[]>(ordersPath, []);
  return orders
    .map((order) => ({
      ...order,
      trackingNumber: order.trackingNumber ?? null,
      adminNotes: order.adminNotes ?? "",
      status: order.status ?? "placed",
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const customerName = input.customerName.trim();
  const customerEmail = input.customerEmail.trim().toLowerCase();
  const items = input.items.filter((item) => item.quantity > 0);

  if (!customerName) {
    throw new Error("Customer name is required.");
  }

  if (!customerEmail || !customerEmail.includes("@")) {
    throw new Error("A valid email is required.");
  }

  if (!items.length) {
    throw new Error("Your cart is empty.");
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 200 ? 0 : 12;
  const total = subtotal + shipping;

  const order: Order = {
    id: `ord_${Date.now()}`,
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
    status: "placed",
    trackingNumber: null,
    adminNotes: "",
    items,
    subtotal,
    shipping,
    total,
  };

  const orders = await readJsonFile<Order[]>(ordersPath, []);
  await writeJsonFile(ordersPath, [order, ...orders]);
  return order;
}

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
  const orders = await getOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    throw new Error("Order not found.");
  }

  const current = orders[index];
  const nextOrder: Order = {
    ...current,
    status: input.status ?? current.status,
    trackingNumber:
      input.trackingNumber === undefined
        ? current.trackingNumber
        : input.trackingNumber?.trim() || null,
    adminNotes:
      input.adminNotes === undefined ? current.adminNotes : input.adminNotes.trim(),
  };

  const nextOrders = [...orders];
  nextOrders[index] = nextOrder;
  await writeJsonFile(ordersPath, nextOrders);
  return nextOrder;
}
