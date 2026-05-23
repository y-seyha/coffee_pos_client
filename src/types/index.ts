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

//
// export type ProductImage = {
//     url: string;
//     id: string | number;
// };
//
// export type product = {
//     id: number;
//     name: string;
//     price: number | string;
//     images?: ProductImage[];
//     final_price?: number;
//     sku: string;
//     description?: string;
// };

export type ProductListResponse = {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
};
export type GetProductsQuery = {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;

    sortBy?: "id" | "name" | "price" | "created_at";

    sortOrder?: "ASC" | "DESC";
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

export type OrderType = "DINEIN" | "DELIVERY" | "TAKEAWAY";

export interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    unit_price: string;
    quantity: number;
    discount_amount: string;
    total_price: string;
}

export interface Payment {
    id: number;
    payment_number: string;
    payment_method: string;
    payment_status: string;
    amount: string;
    transaction_id?: string | null;
    paid_at?: string;
    remarks?: string | null;
}

export interface Order {
    id: number;
    order_number: string;
    order_type: OrderType;

    customer_id?: number | null;
    table_id?: number | null;
    staff_id?: number;

    order_status: OrderStatus;

    notes?: string | null;

    subtotal: string;
    discount_amount: string;
    tax_amount: string;
    grand_total: string;

    cancelled_at?: string | null;

    created_at: string;
    updated_at: string;

    items: OrderItem[];
    payments: Payment[];
}

export type OrderList = {
    data: Order[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
};

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

export type ProductImage = {
    id: string | number;
    url: string;
    originalName?: string;
};

export type ProductCategory = {
    id: number;
    name: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
};

export type ProductDiscount = {
    id: number;
    name: string;
    type: "PERCENTAGE" | "FIXED";
    value: number | string;
    is_active: boolean;
    start_date?: string | null;
    end_date?: string | null;
};

export type ProductVariantGroup = {
    id: number;
    product_id: number;
    variant_group_id: number;
    is_required: boolean;
    sort_order: number;
};

export type Product = {
    id: number;
    category_id: number;
    category?: ProductCategory;
    name: string;
    description?: string;
    sku: string;
    price: number | string;
    cost_price?: number | null;
    final_price?: number;
    discount_id?: number | null;
    discount?: ProductDiscount | null;
    is_available: boolean;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
    images?: ProductImage[];
    variant_groups?: ProductVariantGroup[];
    sold?: number;
};

export type Discount = {
    id: number;
    name: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    is_active: boolean;
    created_at?: string;
    end_date: string | null;
    start_date: string | null;
};

export type CreateDiscountDto = {
    name: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
};
