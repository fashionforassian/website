"use client";

import { useEffect, useMemo, useState } from "react";
import AdminProductEditorModal from "@/components/AdminProductEditorModal";
import { type EditableColorVariant, type ProductFormState } from "@/lib/admin-product-form";
import { type Order, type Subscriber } from "@/lib/backoffice";
import { categoryMeta, formatPrice, type Category, type Product } from "@/lib/data";
import { getColorSwatchValue } from "@/lib/product-options";

const categoryOptions = Object.keys(categoryMeta) as Category[];
type UploadPreset = "cover" | "gallery";
type CropFocus = "center" | "north" | "south" | "east" | "west";

function createEmptyForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    sku: "",
    category: "men",
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
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(createEmptyForm());
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [productsResponse, ordersResponse, subscribersResponse] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/subscribers"),
      ]);
      const [productsData, ordersData, subscribersData] = await Promise.all([
        productsResponse.json() as Promise<Product[]>,
        ordersResponse.json() as Promise<Order[]>,
        subscribersResponse.json() as Promise<Subscriber[]>,
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setSubscribers(subscribersData);
    } finally {
      setLoading(false);
    }
  }

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

  function openCreateModal() {
    setSelectedId(null);
    setForm(createEmptyForm());
    setMessage("");
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setSelectedId(product.id);
    setForm(toFormState(product));
    setMessage("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function updateForm<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
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

    const response = await fetch("/api/uploads", {
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryAppend(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");

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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryReplace(index: number, files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");

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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleColorGalleryAppend(colorId: string, files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");

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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleColorGalleryReplace(colorId: string, index: number, files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");

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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
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

    const payload = {
      id: form.id,
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      category: form.category,
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
      const response = await fetch(
        selectedId ? `/api/admin/products/${selectedId}` : "/api/admin/products",
        {
          method: selectedId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as Product | { message?: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "Save failed.");
      }

      await loadData();
      setMessage(selectedId ? "Product updated." : "Product created.");

      if ("id" in data && data.id) {
        setSelectedId(data.id);
        setForm(toFormState(data));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await loadData();

    if (selectedId === id) {
      setSelectedId(null);
      setForm(createEmptyForm());
      setIsModalOpen(false);
    }

    setMessage("Product deleted.");
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
    setIsModalOpen(true);
  }

  async function applyQuickUpdate(product: Product, patch: Partial<Product>) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, ...patch }),
    });

    await loadData();
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin Console</p>
          <h1 className="mt-3 font-heading text-5xl text-[#111111]">Product Control Center</h1>
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
          <article key={stat.label} className="border border-neutral-200 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{stat.label}</p>
            <p className="mt-3 font-heading text-4xl text-[#111111]">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="mb-8 border border-neutral-200 p-5">
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

      {loading ? (
        <div className="border border-neutral-200 p-8 text-sm text-[#222222]">Loading products...</div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden border border-neutral-200 bg-white">
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
              <div className="space-y-4 p-5">
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
      )}

      <section className="mt-10 grid gap-8 xl:grid-cols-2">
        <div className="border border-neutral-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-neutral-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Orders</p>
              <h2 className="mt-2 font-heading text-3xl text-[#111111]">Recent Checkout Activity</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{orders.length} total</span>
          </div>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-[#222222]">No orders yet.</p>
            ) : (
              orders.slice(0, 8).map((order) => (
                <article key={order.id} className="border border-neutral-200 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{order.id}</p>
                  <h3 className="mt-1 text-sm uppercase tracking-[0.12em] text-[#111111]">{order.customerName}</h3>
                  <p className="mt-1 text-sm text-[#222222]">{order.customerEmail}</p>
                  <p className="mt-3 text-sm text-[#222222]">{order.items.length} items • {formatPrice(order.total)}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-neutral-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Subscribers</p>
              <h2 className="mt-2 font-heading text-3xl text-[#111111]">Newsletter Signups</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{subscribers.length} total</span>
          </div>
          <div className="space-y-4">
            {subscribers.length === 0 ? (
              <p className="text-sm text-[#222222]">No subscribers yet.</p>
            ) : (
              subscribers.slice(0, 10).map((subscriber) => (
                <article key={subscriber.id} className="border border-neutral-200 p-4">
                  <p className="text-sm text-[#111111]">{subscriber.email}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">{subscriber.source}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <AdminProductEditorModal
        isOpen={isModalOpen}
        selectedId={selectedId}
        form={form}
        message={message}
        saving={saving}
        uploading={uploading}
        categoryOptions={categoryOptions}
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
