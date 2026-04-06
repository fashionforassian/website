"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import AdminProductEditorModal from "@/components/AdminProductEditorModal";
import { buildBackendUrl } from "@/lib/backend-api";
import { type EditableColorVariant, type ProductFormState } from "@/lib/admin-product-form";
import { type Order, type OrderStatus, type Subscriber } from "@/lib/backoffice";
import { categoryMeta, formatPrice, type Category, type Product } from "@/lib/data";
import { getColorSwatchValue } from "@/lib/product-options";

type UploadPreset = "cover" | "gallery";
type CropFocus = "center" | "north" | "south" | "east" | "west";
type AdminSection = "catalog" | "categories" | "orders" | "subscribers";
type MessageTone = "neutral" | "success" | "error";
const orderStatusOptions: OrderStatus[] = ["placed", "processing", "shipped", "fulfilled", "cancelled"];

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  depth: number;
  pathKey: string;
  pathSlugs: string[];
  pathLabels: string[];
  children: AdminCategory[];
};

type AdminCategoriesResponse = {
  tree: AdminCategory[];
  flat: AdminCategory[];
};

function pathKeyFromSlugs(slugs: string[]): string {
  return slugs.map((item) => item.trim().toLowerCase()).filter(Boolean).join("/");
}

function createEmptyForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    sku: "",
    category: "men",
    categoryPathSlugs: [],
    price: "",
    compareAtPrice: "",
    inventory: "0",
    popularity: "75",
    status: "active",
    isNew: false,
    isFeatured: false,
    isSale: false,
    description: "",
    fabricCare: "",
    image: "",
    images: [],
    sizes: [],
    tags: [],
    colorVariants: [
      {
        id: "default",
        name: "Black",
        swatch: getColorSwatchValue("Black"),
        image: "",
        images: [],
      },
    ],
  };
}

function toFormState(product: Product): ProductFormState {
  const colorVariants = Array.isArray(product.colorVariants) ? product.colorVariants : [];
  const productColors = Array.isArray(product.colors) ? product.colors : [];
  const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const productTags = Array.isArray(product.tags) ? product.tags : [];
  const productImages = Array.isArray(product.images) ? product.images : [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category,
    categoryPathSlugs: Array.isArray(product.categoryPathSlugs) ? product.categoryPathSlugs : [],
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    inventory: String(product.inventory),
    popularity: String(product.popularity),
    status: product.status,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isSale: product.isSale,
    description: product.description,
    fabricCare: product.fabricCare,
    image: product.image,
    images: productImages,
    sizes: productSizes,
    tags: productTags,
    colorVariants: colorVariants.length
      ? colorVariants
      : [
          {
            id: "default",
            name: productColors[0] ?? "Default",
            swatch: getColorSwatchValue(productColors[0] ?? "Default"),
            image: product.image,
            images: productImages,
          },
        ],
  };
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function reorderItems<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const nextItems = [...items];
  const [selected] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, selected);
  return nextItems;
}

export default function AdminPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [categoryFlat, setCategoryFlat] = useState<AdminCategory[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryParentId, setCategoryParentId] = useState<string>("root");
  const [categoryOrder, setCategoryOrder] = useState("0");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(createEmptyForm());
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("neutral");
  const [uploading, setUploading] = useState(false);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | OrderStatus>("all");
  const [subscriberQuery, setSubscriberQuery] = useState("");
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("catalog");

  const categoryOptions = useMemo<Category[]>(() => {
    const dynamic = categoryFlat
      .filter((item) => item.depth === 0)
      .map((item) => item.slug);
    return dynamic.length ? dynamic : Object.keys(categoryMeta);
  }, [categoryFlat]);

  const categoryPathOptions = useMemo(
    () => categoryFlat.map((item) => ({ key: item.pathKey, slugs: item.pathSlugs, label: item.pathLabels.join(" / ") })),
    [categoryFlat],
  );

  function alignFormCategoryPath(nextCategory: string, currentPathSlugs: string[]): string[] {
    if (!currentPathSlugs.length) {
      return [];
    }

    if (currentPathSlugs[0] === nextCategory) {
      const key = pathKeyFromSlugs(currentPathSlugs);
      const exists = categoryPathOptions.some((item) => item.key === key);
      return exists ? currentPathSlugs : [];
    }

    return [];
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryName("");
    setCategorySlug("");
    setCategoryParentId("root");
    setCategoryOrder("0");
  }

  const adminRequest = useCallback(async (input: string, init?: RequestInit): Promise<Response> => {
    const token = await getToken();

    if (!token) {
      throw new Error("Sign in is required.");
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${token}`);

    return fetch(buildBackendUrl(input), {
      ...init,
      headers,
    });
  }, [getToken]);

  const parseResponse = useCallback(async <T,>(response: Response, fallbackMessage: string): Promise<T> => {
    const data = (await response.json()) as T | { message?: string };

    if (!response.ok) {
      throw new Error(
        typeof data === "object" && data && "message" in data && data.message
          ? String(data.message)
          : fallbackMessage,
      );
    }

    return data as T;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [productsResponse, ordersResponse, subscribersResponse, categoriesResponse] = await Promise.all([
        adminRequest("/api/admin/products"),
        adminRequest("/api/admin/orders"),
        adminRequest("/api/admin/subscribers"),
        adminRequest("/api/admin/categories"),
      ]);
      const [productsData, ordersData, subscribersData, categoriesData] = await Promise.all([
        parseResponse<Product[]>(productsResponse, "Unable to load products."),
        parseResponse<Order[]>(ordersResponse, "Unable to load orders."),
        parseResponse<Subscriber[]>(subscribersResponse, "Unable to load subscribers."),
        parseResponse<AdminCategoriesResponse>(categoriesResponse, "Unable to load categories."),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setSubscribers(subscribersData);
      setCategoryFlat(Array.isArray(categoriesData.flat) ? categoriesData.flat : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load admin data.");
      setMessageTone("error");
    } finally {
      setLoading(false);
    }
  }, [adminRequest, parseResponse]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      setLoading(false);
      setHasAdminAccess(null);
      return;
    }

    let cancelled = false;

    async function verifyAndLoad() {
      setLoading(true);
      setMessage("");
      setMessageTone("neutral");

      try {
        const meResponse = await adminRequest("/api/admin/me");
        await parseResponse<{ ok: boolean; userId: string }>(meResponse, "Unable to verify admin access.");

        if (cancelled) return;
        setHasAdminAccess(true);
        await loadData();
      } catch (error) {
        if (cancelled) return;
        setHasAdminAccess(false);
        setLoading(false);
        setMessage(error instanceof Error ? error.message : "You do not have admin access.");
        setMessageTone("error");
      }
    }

    void verifyAndLoad();

    return () => {
      cancelled = true;
    };
  }, [adminRequest, isLoaded, loadData, parseResponse, userId]);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.category} ${product.sku} ${product.tags.join(" ")}`
        .toLowerCase()
        .includes(term),
    );
  }, [products, query]);

  const stats = useMemo(
    () => [
      { label: "Total Products", value: products.length },
      { label: "Active", value: products.filter((product) => product.status === "active").length },
      { label: "Out Of Stock", value: products.filter((product) => product.inventory === 0).length },
      { label: "Featured", value: products.filter((product) => product.isFeatured).length },
      { label: "Orders", value: orders.length },
      { label: "Subscribers", value: subscribers.length },
    ],
    [orders.length, products, subscribers.length],
  );

  const filteredOrders = useMemo(() => {
    const normalizedQuery = orderQuery.trim().toLowerCase();

    return orders.filter((order) => {
      if (orderStatusFilter !== "all" && order.status !== orderStatusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = `${order.id} ${order.customerName} ${order.customerEmail} ${order.trackingNumber ?? ""} ${order.adminNotes}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [orderQuery, orderStatusFilter, orders]);

  const filteredSubscribers = useMemo(() => {
    const normalizedQuery = subscriberQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return subscribers;
    }

    return subscribers.filter((subscriber) =>
      `${subscriber.email} ${subscriber.source}`.toLowerCase().includes(normalizedQuery),
    );
  }, [subscriberQuery, subscribers]);

  function openCreateModal() {
    setSelectedId(null);
    setForm(createEmptyForm());
    setMessage("");
    setMessageTone("neutral");
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setSelectedId(product.id);
    setForm(toFormState(product));
    setMessage("");
    setMessageTone("neutral");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function updateForm<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => {
      if (key === "category") {
        const nextCategory = String(value);
        const nextPath = alignFormCategoryPath(nextCategory, current.categoryPathSlugs);
        return {
          ...current,
          category: nextCategory,
          categoryPathSlugs: nextPath,
        } as ProductFormState;
      }

      return { ...current, [key]: value };
    });
  }

  function startEditCategory(category: AdminCategory) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setCategoryParentId(category.parentId || "root");
    setCategoryOrder(String(category.order ?? 0));
    setActiveSection("categories");
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCategory(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const payload = {
        name: categoryName,
        slug: categorySlug,
        parentId: categoryParentId === "root" ? null : categoryParentId,
        order: Number(categoryOrder) || 0,
      };

      const response = await adminRequest(
        editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : "/api/admin/categories",
        {
          method: editingCategoryId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      await parseResponse(response, "Unable to save category.");
      await loadData();
      resetCategoryForm();
      setMessage(editingCategoryId ? "Category updated." : "Category created.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save category.");
      setMessageTone("error");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(category: AdminCategory) {
    const confirmed = window.confirm(`Delete category \"${category.name}\"?`);
    if (!confirmed) return;

    setMessage("");
    setMessageTone("neutral");

    try {
      const response = await adminRequest(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      await parseResponse<{ ok: boolean }>(response, "Unable to delete category.");
      await loadData();
      if (editingCategoryId === category.id) {
        resetCategoryForm();
      }
      setMessage("Category deleted.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete category.");
      setMessageTone("error");
    }
  }

  function addSize(value: string) {
    const normalized = value.trim().toUpperCase();
    if (!normalized) return;
    setForm((current) => ({ ...current, sizes: unique([...current.sizes, normalized]) }));
  }

  function removeSize(value: string) {
    setForm((current) => ({ ...current, sizes: current.sizes.filter((size) => size !== value) }));
  }

  function addTag(value: string) {
    const normalized = value.trim();
    if (!normalized) return;
    setForm((current) => ({ ...current, tags: unique([...current.tags, normalized]) }));
  }

  function removeTag(value: string) {
    setForm((current) => ({ ...current, tags: current.tags.filter((tag) => tag !== value) }));
  }

  function addColorVariant(value: string) {
    const name = value.trim();
    if (!name) return;

    setForm((current) => {
      const exists = current.colorVariants.some((variant) => variant.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        return current;
      }

      const fallbackImages = current.images.length ? current.images : current.image ? [current.image] : [];
      const variant: EditableColorVariant = {
        id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        name,
        swatch: getColorSwatchValue(name),
        image: fallbackImages[0] ?? "",
        images: fallbackImages,
      };

      return { ...current, colorVariants: [...current.colorVariants, variant] };
    });
  }

  function removeColorVariant(id: string) {
    setForm((current) => {
      if (current.colorVariants.length <= 1) {
        return current;
      }

      return { ...current, colorVariants: current.colorVariants.filter((variant) => variant.id !== id) };
    });
  }

  function updateColorVariant(id: string, patch: Partial<EditableColorVariant>) {
    setForm((current) => ({
      ...current,
      colorVariants: current.colorVariants.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              ...patch,
              name: patch.name ?? variant.name,
              swatch: patch.swatch ?? variant.swatch,
            }
          : variant,
      ),
    }));
  }

  function makeDefaultColorVariant(id: string) {
    setForm((current) => {
      const variants = [...current.colorVariants];
      const index = variants.findIndex((variant) => variant.id === id);
      if (index <= 0) {
        return current;
      }
      const [selected] = variants.splice(index, 1);
      variants.unshift(selected);

      return {
        ...current,
        colorVariants: variants,
        image: selected.image || current.image,
        images: unique([...selected.images, ...current.images]),
      };
    });
  }

  async function uploadFiles(
    files: FileList | File[],
    options: { preset?: UploadPreset; cropFocus?: CropFocus } = {},
  ): Promise<string[]> {
    const uploadForm = new FormData();
    Array.from(files).forEach((file) => uploadForm.append("files", file));
    uploadForm.append("preset", options.preset ?? "gallery");
    uploadForm.append("cropFocus", options.cropFocus ?? "center");

    const response = await adminRequest("/api/uploads", {
      method: "POST",
      body: uploadForm,
    });

    const data = (await response.json()) as { urls?: string[]; message?: string };

    if (!response.ok || !data.urls) {
      throw new Error(data.message ?? "Upload failed.");
    }

    return data.urls;
  }

  async function handleCoverUpload(files: FileList | null, cropFocus: CropFocus = "center") {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const [url] = await uploadFiles(files, { preset: "cover", cropFocus });
      setForm((current) => {
        const nextImages = current.images.length ? [...current.images] : [];
        if (nextImages.length === 0) nextImages.push(url);
        else nextImages[0] = url;
        const colorVariants = current.colorVariants.map((variant, index) =>
          index === 0
            ? {
                ...variant,
                image: url,
                images: variant.images.length ? [url, ...variant.images.slice(1)] : [url],
              }
            : variant,
        );
        return { ...current, image: url, images: nextImages, colorVariants };
      });
      setMessage("Cover image updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      setMessageTone("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryAppend(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const urls = await uploadFiles(files, { preset: "gallery" });
      setForm((current) => {
        const nextImages = [...current.images, ...urls];
        const colorVariants = current.colorVariants.map((variant, index) =>
          index === 0
            ? {
                ...variant,
                image: variant.image || nextImages[0] || "",
                images: unique([...variant.images, ...urls]),
              }
            : variant,
        );
        return {
          ...current,
          image: current.image || nextImages[0] || "",
          images: nextImages,
          colorVariants,
        };
      });
      setMessage("Gallery updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      setMessageTone("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryReplace(index: number, files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const [url] = await uploadFiles(files, { preset: "gallery" });
      setForm((current) => {
        const nextImages = [...current.images];
        nextImages[index] = url;
        const colorVariants = current.colorVariants.map((variant, variantIndex) =>
          variantIndex === 0
            ? {
                ...variant,
                image: index === 0 ? url : variant.image,
                images:
                  index < variant.images.length
                    ? variant.images.map((image, imageIndex) => (imageIndex === index ? url : image))
                    : variant.images,
              }
            : variant,
        );
        return { ...current, image: index === 0 ? url : current.image, images: nextImages, colorVariants };
      });
      setMessage("Preview updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      setMessageTone("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleColorImageUpload(
    colorId: string,
    files: FileList | null,
    cropFocus: CropFocus = "center",
  ) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const [url] = await uploadFiles(files, { preset: "cover", cropFocus });
      setForm((current) => {
        const colorVariants = current.colorVariants.map((variant) => {
          if (variant.id !== colorId) return variant;
          const nextImages = variant.images.length ? [...variant.images] : [];
          if (nextImages.length === 0) nextImages.push(url);
          else nextImages[0] = url;
          return { ...variant, image: url, images: nextImages };
        });

        const firstVariant = colorVariants[0];
        return {
          ...current,
          colorVariants,
          image: firstVariant?.image || current.image || url,
          images: unique([...current.images, url]),
        };
      });
      setMessage("Color cover updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      setMessageTone("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleColorGalleryAppend(colorId: string, files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const urls = await uploadFiles(files, { preset: "gallery" });
      setForm((current) => {
        const colorVariants = current.colorVariants.map((variant) =>
          variant.id === colorId
            ? {
                ...variant,
                image: variant.image || urls[0] || "",
                images: unique([...variant.images, ...urls]),
              }
            : variant,
        );

        return {
          ...current,
          colorVariants,
          images: unique([...current.images, ...urls]),
        };
      });
      setMessage("Color gallery updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      setMessageTone("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleColorGalleryReplace(colorId: string, index: number, files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const [url] = await uploadFiles(files, { preset: "gallery" });
      setForm((current) => {
        const colorVariants = current.colorVariants.map((variant) => {
          if (variant.id !== colorId) return variant;
          const nextImages = [...variant.images];
          nextImages[index] = url;
          return {
            ...variant,
            image: index === 0 ? url : variant.image,
            images: nextImages,
          };
        });

        const firstVariant = colorVariants[0];
        return {
          ...current,
          colorVariants,
          image: firstVariant?.image || current.image,
          images: unique([...current.images, url]),
        };
      });
      setMessage("Color preview updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      setMessageTone("error");
    } finally {
      setUploading(false);
    }
  }

  function removeColorGalleryImage(colorId: string, index: number) {
    setForm((current) => {
      const colorVariants = current.colorVariants.map((variant) => {
        if (variant.id !== colorId) return variant;
        const nextImages = variant.images.filter((_, imageIndex) => imageIndex !== index);
        return {
          ...variant,
          image: index === 0 ? nextImages[0] ?? current.image : variant.image,
          images: nextImages,
        };
      });

      return {
        ...current,
        colorVariants,
        image: colorVariants[0]?.image || current.image,
      };
    });
  }

  function removeGalleryImage(index: number) {
    setForm((current) => {
      const nextImages = current.images.filter((_, imageIndex) => imageIndex !== index);
      const colorVariants = current.colorVariants.map((variant, variantIndex) =>
        variantIndex === 0
          ? {
              ...variant,
              image: index === 0 ? nextImages[0] ?? "" : variant.image,
              images: variant.images.filter((_, imageIndex) => imageIndex !== index),
            }
          : variant,
      );
      return {
        ...current,
        image: index === 0 ? nextImages[0] ?? "" : current.image,
        images: nextImages,
        colorVariants,
      };
    });
  }

  function makeCoverImage(index: number) {
    setForm((current) => {
      const nextImages = [...current.images];
      const [selectedImage] = nextImages.splice(index, 1);
      nextImages.unshift(selectedImage);
      const colorVariants = current.colorVariants.map((variant, variantIndex) =>
        variantIndex === 0 ? { ...variant, image: selectedImage } : variant,
      );
      return { ...current, image: selectedImage, images: nextImages, colorVariants };
    });
  }

  function reorderGalleryImages(fromIndex: number, toIndex: number) {
    setForm((current) => {
      const nextImages = reorderItems(current.images, fromIndex, toIndex);
      const colorVariants = current.colorVariants.map((variant, variantIndex) =>
        variantIndex === 0
          ? {
              ...variant,
              image: nextImages[0] ?? variant.image,
              images: reorderItems(variant.images, fromIndex, toIndex),
            }
          : variant,
      );

      return {
        ...current,
        images: nextImages,
        image: nextImages[0] ?? current.image,
        colorVariants,
      };
    });
  }

  function reorderColorGalleryImages(colorId: string, fromIndex: number, toIndex: number) {
    setForm((current) => {
      const colorVariants = current.colorVariants.map((variant) => {
        if (variant.id !== colorId) {
          return variant;
        }

        const nextImages = reorderItems(variant.images, fromIndex, toIndex);
        return {
          ...variant,
          image: nextImages[0] ?? variant.image,
          images: nextImages,
        };
      });

      return {
        ...current,
        colorVariants,
        image: colorVariants[0]?.image || current.image,
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setMessageTone("neutral");

    const payload = {
      id: form.id,
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      category: form.category,
      categoryPathSlugs: form.categoryPathSlugs,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      inventory: Number(form.inventory),
      popularity: Number(form.popularity),
      status: form.status,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      isSale: form.isSale,
      description: form.description,
      fabricCare: form.fabricCare,
      image: form.image,
      images: form.images,
      colors: form.colorVariants.map((variant) => variant.name),
      colorVariants: form.colorVariants,
      sizes: form.sizes,
      tags: form.tags,
    };

    try {
      const response = await adminRequest(
        selectedId ? `/api/admin/products/${selectedId}` : "/api/admin/products",
        {
          method: selectedId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await parseResponse<Product>(response, "Save failed.");

      await loadData();
      setMessage(selectedId ? "Product updated." : "Product created.");
      setMessageTone("success");

      if (data.id) {
        setSelectedId(data.id);
        setForm(toFormState(data));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
      setMessageTone("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      const response = await adminRequest(`/api/admin/products/${id}`, { method: "DELETE" });
      await parseResponse<{ ok: boolean }>(response, "Unable to delete product.");
      await loadData();

      if (selectedId === id) {
        setSelectedId(null);
        setForm(createEmptyForm());
        setIsModalOpen(false);
      }

      setMessage("Product deleted.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete product.");
      setMessageTone("error");
    }
  }

  function duplicateProduct(product: Product) {
    setSelectedId(null);
    setForm({
      ...toFormState(product),
      id: undefined,
      name: `${product.name} Copy`,
      slug: "",
      sku: "",
    });
    setMessage("Duplicate opened. Save to create a new product.");
    setMessageTone("success");
    setIsModalOpen(true);
  }

  async function applyQuickUpdate(product: Product, patch: Partial<Product>) {
    setMessage("");
    setMessageTone("neutral");

    try {
      const response = await adminRequest(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, ...patch }),
      });

      await parseResponse<Product>(response, "Quick update failed.");
      await loadData();
      setMessage("Product updated.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Quick update failed.");
      setMessageTone("error");
    }
  }

  async function updateOrderRecord(
    orderId: string,
    patch: { status?: OrderStatus; trackingNumber?: string | null; adminNotes?: string },
  ) {
    setSavingOrderId(orderId);
    setMessage("");
    setMessageTone("neutral");

    try {
      const response = await adminRequest(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      const data = await parseResponse<Order>(response, "Unable to update order.");

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data : order)),
      );
      setMessage(`Order ${orderId} updated.`);
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update order.");
      setMessageTone("error");
    } finally {
      setSavingOrderId(null);
    }
  }

  if (!isLoaded) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-4 py-16 md:px-8">
        <p className="text-sm text-[#222222]">Checking session...</p>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-4 py-16 md:px-8">
        <p className="text-sm text-[#222222]">Sign in to access the admin panel.</p>
      </main>
    );
  }

  if (hasAdminAccess === false) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-4 py-16 md:px-8">
        <p className="text-sm text-red-700">You do not have admin access for this panel.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:py-10 md:px-8 md:py-14">
      <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin Console</p>
          <h1 className="mt-3 font-heading text-3xl text-[#111111] sm:text-4xl xl:text-5xl">Product Control Center</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#222222]">
            Every product now has its own card with image, stock, pricing, and quick actions. Click a
            card or the edit button to open the full popup editor.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="border border-[#111111] px-5 py-3 text-xs uppercase tracking-[0.18em] text-[#111111] hover:bg-[#111111] hover:text-white"
        >
          New Product
        </button>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{stat.label}</p>
            <p className="mt-3 font-heading text-3xl text-[#111111] sm:text-4xl">{stat.value}</p>
          </article>
        ))}
      </section>

      {message ? (
        <section
          aria-live="polite"
          className={`mb-8 rounded-2xl border px-4 py-3 text-sm sm:px-5 ${
            messageTone === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : messageTone === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-neutral-200 bg-white text-[#222222]"
          }`}
        >
          {message}
        </section>
      ) : null}

      <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-2 sm:p-3">
        <div className="grid gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveSection("catalog")}
            className={`px-4 py-3 text-xs uppercase tracking-[0.18em] transition ${
              activeSection === "catalog"
                ? "bg-[#111111] text-white"
                : "text-[#111111] hover:bg-neutral-100"
            }`}
          >
            Catalog
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("orders")}
            className={`px-4 py-3 text-xs uppercase tracking-[0.18em] transition ${
              activeSection === "orders"
                ? "bg-[#111111] text-white"
                : "text-[#111111] hover:bg-neutral-100"
            }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("categories")}
            className={`px-4 py-3 text-xs uppercase tracking-[0.18em] transition ${
              activeSection === "categories"
                ? "bg-[#111111] text-white"
                : "text-[#111111] hover:bg-neutral-100"
            }`}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("subscribers")}
            className={`px-4 py-3 text-xs uppercase tracking-[0.18em] transition ${
              activeSection === "subscribers"
                ? "bg-[#111111] text-white"
                : "text-[#111111] hover:bg-neutral-100"
            }`}
          >
            Subscribers
          </button>
        </div>
      </section>

      {activeSection === "catalog" ? (
        <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Catalog Grid</p>
              <p className="mt-2 text-sm text-[#222222]">{filteredProducts.length} products visible</p>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product, SKU, tag..."
              className="h-11 w-full max-w-md border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
            />
          </div>
        </section>
      ) : null}

      {activeSection === "catalog" && loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-[#222222]">Loading products...</div>
      ) : null}

      {activeSection === "catalog" && !loading ? (
        <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <button type="button" onClick={() => openEditModal(product)} className="block w-full text-left">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                      No image
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {product.isFeatured ? (
                      <span className="bg-[#111111] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                        Featured
                      </span>
                    ) : null}
                    {product.inventory === 0 ? (
                      <span className="bg-red-600 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                        Out Of Stock
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
              <div className="space-y-4 p-4 sm:p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    {product.category} • {product.sku}
                  </p>
                  <h2 className="mt-2 text-base uppercase tracking-[0.12em] text-[#111111]">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm text-[#222222]">
                    {formatPrice(product.price)} • {product.inventory} in stock
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="border border-[#111111] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:bg-[#111111] hover:text-white"
                  >
                    Edit Product
                  </button>
                  <button
                    type="button"
                    onClick={() => void applyQuickUpdate(product, { inventory: product.inventory === 0 ? 12 : 0 })}
                    className="border border-neutral-300 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                  >
                    {product.inventory === 0 ? "Restock" : "Sold Out"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void applyQuickUpdate(product, { isFeatured: !product.isFeatured })}
                    className="border border-neutral-300 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                  >
                    {product.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateProduct(product)}
                    className="border border-neutral-300 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(product.id)}
                    className="border border-red-300 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-red-600 hover:border-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {activeSection === "orders" ? (
        <section className="mt-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 border-b border-neutral-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Orders</p>
              <h2 className="mt-2 font-heading text-3xl text-[#111111]">Order Management</h2>
              <p className="mt-2 text-sm text-[#222222]">
                Search, update status, attach tracking, and keep internal notes for each order.
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{filteredOrders.length} visible</span>
          </div>

          <div className="mb-5 grid gap-3 lg:grid-cols-[1fr,220px]">
            <input
              value={orderQuery}
              onChange={(event) => setOrderQuery(event.target.value)}
              placeholder="Search by order ID, customer, email, tracking..."
              className="h-11 border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
            />
            <select
              value={orderStatusFilter}
              onChange={(event) => setOrderStatusFilter(event.target.value as "all" | OrderStatus)}
              className="h-11 border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
            >
              <option value="all">All statuses</option>
              {orderStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-sm text-[#222222]">No matching orders.</p>
            ) : (
              filteredOrders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{order.id}</p>
                      <h3 className="mt-1 text-sm uppercase tracking-[0.12em] text-[#111111]">{order.customerName}</h3>
                      <p className="mt-1 text-sm text-[#222222]">{order.customerEmail}</p>
                      <p className="mt-2 text-sm text-[#222222]">
                        {order.items.length} items • {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Status</span>
                        <select
                          value={order.status}
                          onChange={(event) =>
                            void updateOrderRecord(order.id, { status: event.target.value as OrderStatus })
                          }
                          disabled={savingOrderId === order.id}
                          className="h-10 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#111111] sm:min-w-[180px]"
                        >
                          {orderStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="space-y-2">
                        <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Placed</span>
                        <p className="text-sm text-[#222222]">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 2xl:grid-cols-[1fr,1fr]">
                    <label className="space-y-2">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Tracking Number</span>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          defaultValue={order.trackingNumber ?? ""}
                          placeholder="Add tracking number"
                          className="h-10 flex-1 border border-neutral-300 px-3 text-sm outline-none focus:border-[#111111]"
                          onBlur={(event) =>
                            void updateOrderRecord(order.id, { trackingNumber: event.target.value || null })
                          }
                        />
                        <button
                          type="button"
                          disabled={savingOrderId === order.id}
                          onClick={() =>
                            void updateOrderRecord(order.id, {
                              status: order.status === "placed" ? "processing" : order.status,
                            })
                          }
                          className="h-10 border border-neutral-300 px-4 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111] disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </label>

                    <div className="space-y-2">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Quick Actions</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void updateOrderRecord(order.id, { status: "processing" })}
                          className="border border-neutral-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                        >
                          Mark Processing
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateOrderRecord(order.id, { status: "shipped" })}
                          className="border border-neutral-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                        >
                          Mark Shipped
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateOrderRecord(order.id, { status: "fulfilled" })}
                          className="border border-neutral-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                        >
                          Mark Fulfilled
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateOrderRecord(order.id, { status: "cancelled" })}
                          className="border border-red-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-600"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="mt-4 block space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Internal Notes</span>
                    <textarea
                      defaultValue={order.adminNotes}
                      rows={3}
                      placeholder="Add packing notes, payment notes, or customer follow-up details"
                      className="w-full border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#111111]"
                      onBlur={(event) => void updateOrderRecord(order.id, { adminNotes: event.target.value })}
                    />
                  </label>

                  <div className="mt-4 border-t border-neutral-200 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Order Items</p>
                    <div className="mt-3 space-y-3">
                      {order.items.map((item, index) => (
                        <div key={`${order.id}-${item.productId}-${index}`} className="flex flex-col gap-3 border border-neutral-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.12em] text-[#111111]">{item.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                              Qty {item.quantity} • Size {item.size ?? "-"} • Color {item.color ?? "-"}
                            </p>
                          </div>
                          <p className="text-sm text-[#222222]">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
        </section>
      ) : null}

      {activeSection === "categories" ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-[360px,1fr]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Category Editor</p>
            <h2 className="mt-2 font-heading text-2xl text-[#111111]">
              {editingCategoryId ? "Edit Category" : "Create Category"}
            </h2>
            <form onSubmit={saveCategory} className="mt-4 space-y-4">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Name</span>
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  required
                  className="h-10 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#111111]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Slug (optional)</span>
                <input
                  value={categorySlug}
                  onChange={(event) => setCategorySlug(event.target.value)}
                  className="h-10 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#111111]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Parent</span>
                <select
                  value={categoryParentId}
                  onChange={(event) => setCategoryParentId(event.target.value)}
                  className="h-10 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#111111]"
                >
                  <option value="root">Main Category (No Parent)</option>
                  {categoryFlat.map((category) => (
                    <option key={category.id} value={category.id}>
                      {"- ".repeat(category.depth)}{category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Sort Order</span>
                <input
                  type="number"
                  value={categoryOrder}
                  onChange={(event) => setCategoryOrder(event.target.value)}
                  className="h-10 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#111111]"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="border border-[#111111] bg-[#111111] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#111111] disabled:opacity-50"
                >
                  {savingCategory ? "Saving..." : editingCategoryId ? "Update" : "Create"}
                </button>
                {editingCategoryId ? (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="border border-neutral-300 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="mb-4 border-b border-neutral-200 pb-4">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Category Tree</p>
              <h2 className="mt-2 font-heading text-2xl text-[#111111]">Manage Main Categories & Subcategories</h2>
            </div>
            {categoryFlat.length === 0 ? (
              <p className="text-sm text-[#222222]">No categories yet. Create your first main category.</p>
            ) : (
              <div className="space-y-3">
                {categoryFlat.map((category) => (
                  <article key={category.id} className="rounded-xl border border-neutral-200 p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">{category.pathLabels.join(" / ")}</p>
                        <p className="mt-1 text-sm text-[#111111]">Slug: {category.slug}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEditCategory(category)}
                          className="border border-neutral-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteCategory(category)}
                          className="border border-red-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {activeSection === "subscribers" ? (
        <section className="mt-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Subscribers</p>
              <h2 className="mt-2 font-heading text-3xl text-[#111111]">Newsletter Signups</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{filteredSubscribers.length} visible</span>
          </div>
          <div className="mb-5 grid gap-3 lg:grid-cols-[1fr,220px]">
            <input
              value={subscriberQuery}
              onChange={(event) => setSubscriberQuery(event.target.value)}
              placeholder="Search by email or source..."
              className="h-11 border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
            />
            <div className="flex items-center justify-end text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              {subscribers.length} total
            </div>
          </div>
          <div className="space-y-4">
            {filteredSubscribers.length === 0 ? (
              <p className="text-sm text-[#222222]">No subscribers yet.</p>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <article key={subscriber.id} className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-sm text-[#111111]">{subscriber.email}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">{subscriber.source}</p>
                </article>
              ))
            )}
          </div>
        </div>
        </section>
      ) : null}

      <AdminProductEditorModal
        isOpen={isModalOpen}
        selectedId={selectedId}
        form={form}
        message={message}
        messageTone={messageTone}
        saving={saving}
        uploading={uploading}
        categoryOptions={categoryOptions}
        categoryPathOptions={categoryPathOptions}
        onClose={closeModal}
        onSubmit={handleSubmit}
        updateForm={updateForm}
        addSize={addSize}
        removeSize={removeSize}
        addTag={addTag}
        removeTag={removeTag}
        addColorVariant={addColorVariant}
        removeColorVariant={removeColorVariant}
        updateColorVariant={updateColorVariant}
        makeDefaultColorVariant={makeDefaultColorVariant}
        handleCoverUpload={handleCoverUpload}
        handleGalleryAppend={handleGalleryAppend}
        handleGalleryReplace={handleGalleryReplace}
        removeGalleryImage={removeGalleryImage}
        makeCoverImage={makeCoverImage}
        reorderGalleryImages={reorderGalleryImages}
        handleColorImageUpload={handleColorImageUpload}
        handleColorGalleryAppend={handleColorGalleryAppend}
        handleColorGalleryReplace={handleColorGalleryReplace}
        removeColorGalleryImage={removeColorGalleryImage}
        reorderColorGalleryImages={reorderColorGalleryImages}
      />
    </main>
  );
}
