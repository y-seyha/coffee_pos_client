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

export type OrderStatusRaw = {
    status: string;
    count: number;
};

export type TopProductDto = {
    product_id: number;
    name: string;
    total_sold: number;
};

export type AnalyticsReport = {
    summary: {
        total_orders: number;
        completed_orders: number;
        pending_orders: number;
        cancelled_orders?: number;
        confirmed_orders?: number;
    };
    sales: {
        daily: number;
        monthly: number;
    };
    top_products: TopProductDto[];
    status_stats: OrderStatusRaw[];
    payment?: PaymentDashboard;
};

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";


export interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Payment {
    id: number;
    transaction_id?: string;
    payment_status:
        | "PENDING"
        | "PAID"
        | "FAILED"
        | "REFUNDED";
    amount: number;
    remarks?: string;
    paid_at?: string;
    created_at: string;
}

export interface Order {
    id: number;
    order_number?: string;
    order_status: OrderStatus;
    grand_total: number;
    order_type?: string;
    cancelled_at?: string | null;
    created_at: string;
    updated_at?: string;
    items?: OrderItem[];
    payments?: Payment[];
}

export interface OrderStatusStat {
    status: OrderStatus;
    count: number;
}

export type OrderStatusStats =
    OrderStatusStat[];

export interface OrderReport {
    summary: {
        total_orders: number;
        completed_orders: number;
        pending_orders: number;
    };
    sales: {
        daily: number;
        monthly: number;
    };
    top_products: TopProductDto[];
    status_stats: OrderStatusStats;
}

export type PaymentMethodStat = {
    method: string;
    count: number;
};

export type PaymentDashboard = {
    revenue: number;
    today_payments: number;
    failed_payments: number;
    refunded_payments: number;
    payment_methods: PaymentMethodStat[];
};

export type PaginatedResponse<T> = {
    data: T;
    total: number;
    page: number;
    limit: number;
};


export type VariantOption = {
    id: number;
    name: string;
    variant_group_id: number;
    variant_group?: VariantGroup;
    price_adjustment_type: "ADD" | "SET" | "PERCENT";
    price_adjustment: number;
    is_default: boolean;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
};

export type VariantGroup = {
    id: number;
    name: string;
    code: string;
    sort_order: number;
    options?: VariantOption[];
};

export type CreateVariantGroupDto = {
    name: string;
    code: string;
    sort_order?: number;
};

export type UpdateVariantGroupDto = {
    name?: string;
    code?: string;
    sort_order?: number;
};

export type CreateVariantOptionDto = {
    variant_group_id: number;
    name: string;
    price_adjustment_type?: "ADD" | "SET" | "PERCENT";
    price_adjustment?: number;
    is_default?: boolean;
    is_active?: boolean;
    sort_order?: number;
};

export type UpdateVariantOptionDto = {
    name?: string;
    value?: string;
    variant_group_id?: number;
};
