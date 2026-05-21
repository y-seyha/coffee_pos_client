export type User = {
    id: number;
    email: string;
    name: string;
    role: string;
};

export type CartVariant = {
    group: string;
    option: string;
    price: number;
};

export type CartItem = {
    id: number;

    product: {
        id: number;
        name: string;
        base_price: number;
    };

    unit_price: number;
    quantity: number;
    total_price: number;

    price_breakdown?: {
        base_price: number;
        addon_price: number;
        unit_price: number;
        price_before_discount: number;
        discount: number;
        final_price: number;
    };

    variants: CartVariant[];
};

export type CartSummary = {
    items_count: number;
    quantity_total: number;
    subtotal: number;
    discount_total: number;
    grand_total: number;
    tax: number;
};

export type CartResponse = {
    cart: {
        id: number;
        staff: {
            id: number;
            name: string;
            email: string;
        };
        items: CartItem[];
    };
    summary: CartSummary;
};


export type ProductImage = {
    url: string;
    id: string | number;
};

export type Product = {
    id: number;
    name: string;
    price: number | string;
    images?: ProductImage[];
    final_price?: number;
    sku: string;
    description?: string;
};

export type ProductListResponse = {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
};

export type ClientGetProductsQuery = {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    sort?: "default" | "price_asc" | "price_desc" | "newest" | "name_asc";
};

export type CreateProductDto = {
    category_id: number;
    name: string;
    sku: string;
    price: number;
    description?: string;
};

export type CheckoutApiResponse = {
    message: string;

    order: {
        id: number;
        order_number: string;
        subtotal: number;
        discount_total: number;
        tax: number;
        grand_total: number;
        payment_method: "KHQR" | "CASH";
        items: CartItem[];
    };

    payment: {
        id: number;
        payment_number: string;
        method: "KHQR" | "CASH";
        status: string;
        amount: number;
    };
};