module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/website/frontend/components/providers/CartProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const CART_STORAGE_KEY = "fashion-asia-cart";
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function buildLineId(input) {
    return `${input.productId}-${input.size ?? "default"}-${input.color ?? "default"}`;
}
function CartProvider({ children }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const stored = window.localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setItems(parsed);
            } catch  {
                setItems([]);
            }
        }
        setHydrated(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hydrated) {
            return;
        }
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [
        items,
        hydrated
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const cartCount = items.reduce((sum, item)=>sum + item.quantity, 0);
        const subtotal = items.reduce((sum, item)=>sum + item.price * item.quantity, 0);
        return {
            items,
            cartCount,
            subtotal,
            addToCart: (input)=>{
                const quantity = Math.max(1, input.quantity ?? 1);
                const lineId = buildLineId(input);
                setItems((current)=>{
                    const existing = current.find((item)=>item.lineId === lineId);
                    if (existing) {
                        return current.map((item)=>item.lineId === lineId ? {
                                ...item,
                                quantity: item.quantity + quantity
                            } : item);
                    }
                    return [
                        ...current,
                        {
                            lineId,
                            productId: input.productId,
                            slug: input.slug,
                            name: input.name,
                            image: input.image,
                            price: input.price,
                            size: input.size,
                            color: input.color,
                            quantity
                        }
                    ];
                });
            },
            updateQuantity: (lineId, quantity)=>{
                const normalized = Math.max(1, quantity);
                setItems((current)=>current.map((item)=>item.lineId === lineId ? {
                            ...item,
                            quantity: normalized
                        } : item));
            },
            removeFromCart: (lineId)=>{
                setItems((current)=>current.filter((item)=>item.lineId !== lineId));
            },
            clearCart: ()=>{
                setItems([]);
            }
        };
    }, [
        items
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/website/frontend/components/providers/CartProvider.tsx",
        lineNumber: 136,
        columnNumber: 10
    }, this);
}
function useCart() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
}),
"[project]/website/frontend/lib/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryMeta",
    ()=>categoryMeta,
    "categoryShowcase",
    ()=>categoryShowcase,
    "editorialCampaign",
    ()=>editorialCampaign,
    "featuredCollections",
    ()=>featuredCollections,
    "formatPrice",
    ()=>formatPrice,
    "navCategories",
    ()=>navCategories,
    "products",
    ()=>products,
    "promotionalBanner",
    ()=>promotionalBanner,
    "sortProducts",
    ()=>sortProducts
]);
const navCategories = [
    {
        label: "Men",
        href: "/men"
    },
    {
        label: "Women",
        href: "/women"
    },
    {
        label: "Kids",
        href: "/kids"
    },
    {
        label: "New Arrivals",
        href: "/new-arrivals"
    },
    {
        label: "Collections",
        href: "/collections"
    },
    {
        label: "Sale",
        href: "/sale"
    }
];
const featuredCollections = [
    {
        title: "Resort Linen",
        subtitle: "Lightweight silhouettes for tropical city days",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "Monochrome Tailoring",
        subtitle: "Refined essentials inspired by metropolitan nights",
        image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        title: "Street Atelier",
        subtitle: "Modern cuts blending utility with elevated detail",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
    }
];
const categoryShowcase = [
    {
        name: "Men",
        slug: "men",
        image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        name: "Women",
        slug: "women",
        image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80"
    },
    {
        name: "Accessories",
        slug: "accessories",
        image: "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        name: "Footwear",
        slug: "footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
    }
];
const products = [
    {
        id: "p-1",
        slug: "tailored-linen-blazer",
        name: "Tailored Linen Blazer",
        price: 129,
        category: "women",
        colors: [
            "Ivory",
            "Black"
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L"
        ],
        image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "A single-breasted linen blazer with a relaxed, architectural line and soft shoulder structure.",
        fabricCare: "55% linen, 45% cotton. Dry clean recommended.",
        popularity: 94,
        isNew: true
    },
    {
        id: "p-2",
        slug: "relaxed-pleat-trousers",
        name: "Relaxed Pleat Trousers",
        price: 89,
        category: "men",
        colors: [
            "Stone",
            "Charcoal"
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        image: "https://images.pexels.com/photos/7691080/pexels-photo-7691080.jpeg?auto=compress&cs=tinysrgb&w=900",
        images: [
            "https://images.pexels.com/photos/7691080/pexels-photo-7691080.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        description: "Straight-leg trousers with double pleats and an easy drape for day-to-evening transitions.",
        fabricCare: "70% polyester, 28% viscose, 2% elastane. Cold gentle wash.",
        popularity: 88,
        isNew: true
    },
    {
        id: "p-3",
        slug: "sculpted-knit-top",
        name: "Sculpted Knit Top",
        price: 59,
        category: "women",
        colors: [
            "Black",
            "Beige"
        ],
        sizes: [
            "XS",
            "S",
            "M"
        ],
        image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Fine-rib knit top designed with a close fit and clean neckline.",
        fabricCare: "66% viscose, 34% nylon. Hand wash cold and dry flat.",
        popularity: 90,
        isNew: false
    },
    {
        id: "p-4",
        slug: "leather-crossbody-mini",
        name: "Leather Crossbody Mini",
        price: 139,
        category: "accessories",
        colors: [
            "Cocoa",
            "Black"
        ],
        sizes: [
            "One Size"
        ],
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Compact structured bag with adjustable strap and brushed metal hardware.",
        fabricCare: "100% leather. Wipe with soft dry cloth.",
        popularity: 83,
        isNew: false
    },
    {
        id: "p-5",
        slug: "minimal-low-top-sneakers",
        name: "Minimal Low-Top Sneakers",
        price: 119,
        category: "footwear",
        colors: [
            "White",
            "Sand"
        ],
        sizes: [
            "39",
            "40",
            "41",
            "42",
            "43"
        ],
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900",
        images: [
            "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        description: "Refined leather sneakers with tonal sole and low-profile construction.",
        fabricCare: "Leather upper and rubber outsole. Spot clean only.",
        popularity: 96,
        isNew: true
    },
    {
        id: "p-6",
        slug: "oversized-poplin-shirt",
        name: "Oversized Poplin Shirt",
        price: 69,
        category: "women",
        colors: [
            "White",
            "Sky"
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L"
        ],
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Relaxed cotton poplin shirt cut long with a sharp point collar.",
        fabricCare: "100% cotton. Machine wash at 30C.",
        popularity: 79,
        isNew: false
    },
    {
        id: "p-7",
        slug: "utility-bomber-jacket",
        name: "Utility Bomber Jacket",
        price: 149,
        category: "men",
        colors: [
            "Olive",
            "Black"
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        image: "https://images.pexels.com/photos/1040421/pexels-photo-1040421.jpeg?auto=compress&cs=tinysrgb&w=900",
        images: [
            "https://images.pexels.com/photos/1040421/pexels-photo-1040421.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        description: "Technical bomber with matte finish, concealed pockets, and lightweight insulation.",
        fabricCare: "Shell: 100% nylon. Lining: 100% polyester. Gentle wash.",
        popularity: 87,
        isNew: true
    },
    {
        id: "p-8",
        slug: "woven-belted-midi-dress",
        name: "Woven Belted Midi Dress",
        price: 109,
        category: "women",
        colors: [
            "Sand",
            "Ink"
        ],
        sizes: [
            "XS",
            "S",
            "M",
            "L"
        ],
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Fluid midi dress with removable belt and understated side seam pockets.",
        fabricCare: "100% viscose. Cold hand wash.",
        popularity: 81,
        isNew: true
    },
    {
        id: "p-9",
        slug: "structured-tote",
        name: "Structured Tote",
        price: 159,
        category: "accessories",
        colors: [
            "Taupe",
            "Black"
        ],
        sizes: [
            "One Size"
        ],
        image: "https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=900",
        images: [
            "https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        description: "Large tote with structured profile and reinforced handles for daily use.",
        fabricCare: "100% leather. Keep away from moisture.",
        popularity: 85,
        isNew: false
    },
    {
        id: "p-10",
        slug: "soft-calf-ankle-boots",
        name: "Soft Calf Ankle Boots",
        price: 179,
        category: "footwear",
        colors: [
            "Black",
            "Mocha"
        ],
        sizes: [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        image: "https://images.unsplash.com/photo-1608256246200-53e8b47b6a21?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1608256246200-53e8b47b6a21?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Minimal ankle boots crafted with soft calf leather and stacked heel.",
        fabricCare: "Leather upper and lining. Professional care recommended.",
        popularity: 89,
        isNew: false
    },
    {
        id: "p-11",
        slug: "fine-merino-crewneck",
        name: "Fine Merino Crewneck",
        price: 79,
        category: "men",
        colors: [
            "Camel",
            "Navy"
        ],
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],
        image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Fine-gauge merino crewneck with a refined fit and ribbed finish.",
        fabricCare: "100% merino wool. Hand wash cold.",
        popularity: 86,
        isNew: true
    },
    {
        id: "p-12",
        slug: "layered-chain-necklace",
        name: "Layered Chain Necklace",
        price: 49,
        category: "accessories",
        colors: [
            "Muted Gold"
        ],
        sizes: [
            "One Size"
        ],
        image: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=900",
        images: [
            "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
            "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        description: "Delicate layered necklace set in a muted gold finish.",
        fabricCare: "Brass alloy with protective finish. Avoid water and perfume.",
        popularity: 78,
        isNew: true
    }
];
const promotionalBanner = {
    title: "Mid-Season Edit",
    subtitle: "Up to 30% on selected pieces crafted for the warmer season.",
    cta: "Shop The Edit",
    href: "/products"
};
const editorialCampaign = {
    title: "Campaign 2026: Movement In Form",
    description: "A study in contrast where fluid tailoring meets urban function. Discover silhouettes designed for pace, texture, and contemporary city life.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
};
const categoryMeta = {
    men: {
        title: "Menswear",
        banner: "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=1600"
    },
    women: {
        title: "Womenswear",
        banner: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1600&q=80"
    },
    accessories: {
        title: "Accessories",
        banner: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1600"
    },
    footwear: {
        title: "Footwear",
        banner: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&q=80"
    }
};
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}
function sortProducts(items, sort) {
    const copy = [
        ...items
    ];
    switch(sort){
        case "price-low-high":
            return copy.sort((a, b)=>a.price - b.price);
        case "price-high-low":
            return copy.sort((a, b)=>b.price - a.price);
        case "popularity":
            return copy.sort((a, b)=>b.popularity - a.popularity);
        case "newest":
        default:
            return copy.sort((a, b)=>Number(b.isNew) - Number(a.isNew));
    }
}
}),
"[project]/website/frontend/components/Navbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$37$2e$0_react_f49656590d5b36b9795d88d43abeefe5$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/framer-motion@12.37.0_react_f49656590d5b36b9795d88d43abeefe5/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$components$2f$providers$2f$CartProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/components/providers/CartProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/lib/data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const megaMenu = {
    men: [
        "Outerwear",
        "Shirts",
        "Trousers",
        "Denim",
        "Footwear",
        "Accessories"
    ],
    women: [
        "Dresses",
        "Tailoring",
        "Knitwear",
        "Outerwear",
        "Footwear",
        "Accessories"
    ],
    kids: [
        "Shirts & Tops",
        "Pants & Shorts",
        "Dresses & Skirts",
        "Outerwear",
        "Footwear",
        "Accessories"
    ]
};
function Navbar() {
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeMenu, setActiveMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { cartCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$components$2f$providers$2f$CartProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur",
        onMouseLeave: ()=>setActiveMenu(null),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Toggle navigation",
                        className: "border border-neutral-300 px-3 py-2 text-xs tracking-[0.2em] md:hidden",
                        onClick: ()=>setMobileOpen((prev)=>!prev),
                        type: "button",
                        children: "MENU"
                    }, void 0, false, {
                        fileName: "[project]/website/frontend/components/Navbar.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "font-heading text-xl tracking-[0.2em] text-[#111111]",
                        children: "FASHION ASIA"
                    }, void 0, false, {
                        fileName: "[project]/website/frontend/components/Navbar.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.18em] md:flex",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navCategories"].map((item)=>{
                            const hasMegaMenu = item.label === "Men" || item.label === "Women" || item.label === "Kids";
                            const menuKey = item.label.toLowerCase();
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onMouseEnter: hasMegaMenu ? ()=>setActiveMenu(menuKey) : ()=>setActiveMenu(null),
                                onFocus: hasMegaMenu ? ()=>setActiveMenu(menuKey) : ()=>setActiveMenu(null),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "text-[#222222] transition-colors hover:text-[#111111]",
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/website/frontend/components/Navbar.tsx",
                                    lineNumber: 71,
                                    columnNumber: 17
                                }, this)
                            }, item.label, false, {
                                fileName: "[project]/website/frontend/components/Navbar.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/website/frontend/components/Navbar.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 text-xs uppercase tracking-[0.15em]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/search",
                                className: "hidden md:inline hover:text-[#111111]",
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/website/frontend/components/Navbar.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/cart",
                                className: "hover:text-[#111111]",
                                children: [
                                    "Cart (",
                                    cartCount,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/website/frontend/components/Navbar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/website/frontend/components/Navbar.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/website/frontend/components/Navbar.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            activeMenu ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$37$2e$0_react_f49656590d5b36b9795d88d43abeefe5$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: -15
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    y: -15
                },
                transition: {
                    duration: 0.25,
                    ease: "easeOut"
                },
                className: "hidden border-t border-neutral-200 bg-white md:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-[1400px] px-8 py-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-5 text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-semibold",
                            children: activeMenu === "men" ? "Men's Collection" : activeMenu === "women" ? "Women's Collection" : "Kids' Collection"
                        }, void 0, false, {
                            fileName: "[project]/website/frontend/components/Navbar.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "grid grid-cols-3 gap-y-3 gap-x-8 text-sm",
                            children: megaMenu[activeMenu].map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$37$2e$0_react_f49656590d5b36b9795d88d43abeefe5$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].li, {
                                    initial: {
                                        opacity: 0,
                                        x: -10
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    transition: {
                                        duration: 0.3,
                                        delay: idx * 0.05,
                                        ease: "easeOut"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/${activeMenu}`,
                                        className: "text-[#222222] transition-colors hover:text-[#111111] hover:translate-x-1 inline-block",
                                        children: item
                                    }, void 0, false, {
                                        fileName: "[project]/website/frontend/components/Navbar.tsx",
                                        lineNumber: 112,
                                        columnNumber: 19
                                    }, this)
                                }, item, false, {
                                    fileName: "[project]/website/frontend/components/Navbar.tsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/website/frontend/components/Navbar.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/website/frontend/components/Navbar.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/website/frontend/components/Navbar.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this) : null,
            mobileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "border-t border-neutral-200 bg-white px-4 py-5 md:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-3 text-xs uppercase tracking-[0.15em]",
                    children: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navCategories"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "block py-1 text-[#222222]",
                                    onClick: ()=>setMobileOpen(false),
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/website/frontend/components/Navbar.tsx",
                                    lineNumber: 130,
                                    columnNumber: 17
                                }, this)
                            }, item.label, false, {
                                fileName: "[project]/website/frontend/components/Navbar.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/about",
                                className: "block py-1 text-[#222222]",
                                onClick: ()=>setMobileOpen(false),
                                children: "About"
                            }, void 0, false, {
                                fileName: "[project]/website/frontend/components/Navbar.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/website/frontend/components/Navbar.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/contact",
                                className: "block py-1 text-[#222222]",
                                onClick: ()=>setMobileOpen(false),
                                children: "Contact"
                            }, void 0, false, {
                                fileName: "[project]/website/frontend/components/Navbar.tsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/website/frontend/components/Navbar.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/website/frontend/components/Navbar.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/website/frontend/components/Navbar.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/website/frontend/components/Navbar.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/website/frontend/components/SmoothScrollProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SmoothScrollProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_9d8d1bf7a8807769963b5151bd760c41/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lenis$40$1$2e$3$2e$18_react$40$19$2e$2$2e$3$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/frontend/node_modules/.pnpm/lenis@1.3.18_react@19.2.3/node_modules/lenis/dist/lenis.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function SmoothScrollProvider({ children }) {
    const lenisRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rafIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize Lenis for smooth scrolling
        const lenis = new __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lenis$40$1$2e$3$2e$18_react$40$19$2e$2$2e$3$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
            duration: 1.2,
            easing: (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
            mouseMultiplier: 1,
            touchMultiplier: 2,
            wheelMultiplier: 1
        });
        lenisRef.current = lenis;
        // Use Lenis's built-in RAF handler
        function raf(time) {
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        }
        // Start the animation loop
        rafIdRef.current = requestAnimationFrame(raf);
        // Prevent Lenis from conflicting with scroll events
        const handleWheel = (e)=>{
        // Let Lenis handle the scroll
        };
        window.addEventListener("wheel", handleWheel, {
            passive: false
        });
        return ()=>{
            // Clean up
            window.removeEventListener("wheel", handleWheel);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
            lenis.destroy();
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_9d8d1bf7a8807769963b5151bd760c41$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1eab97f0._.js.map