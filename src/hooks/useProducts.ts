"use client";

import { useState, useEffect } from "react";
import { productApi } from "@/lib/api/product.api";
import { ClientGetProductsQuery, Product } from "@/types";

type ProductSource = "all" | "best-sellers" | "category";

export function useProducts(initialParams: ClientGetProductsQuery = {}) {
    const [params, setParams] = useState<ClientGetProductsQuery>(initialParams);
    const [source, setSource] = useState<ProductSource>("all");

    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const extractProducts = (res: any): Product[] => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    };

    const fetchProducts = async (
        override?: ClientGetProductsQuery,
        newSource?: ProductSource
    ) => {
        try {
            setLoading(true);
            setError(null);

            const finalSource = newSource || source;
            const query = { ...params, ...override };

            let res: any;

            switch (finalSource) {
                case "best-sellers":
                    console.log("Best sellers Hit");
                    res = await productApi.getBestSellers(query.limit ?? 20);
                    break;

                case "category":
                    console.log("Category hit");
                    if (!query.categoryId) {
                        setData([]);
                        setLoading(false);
                        return;
                    }
                    res = await productApi.getByCategory(Number(query.categoryId));
                    break;

                default:
                    console.log("All Hit");
                    res = await productApi.getClientProducts(query);
                    break;
            }

            setData(extractProducts(res));
            setParams(query);
            setSource(finalSource);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // initial load
    useEffect(() => {
        fetchProducts({}, "all");
    }, []);

    return {
        data,
        loading,
        error,

        refetch: (override?: ClientGetProductsQuery) =>
            fetchProducts(override, source),

        setAll: (params?: ClientGetProductsQuery) =>
            fetchProducts(params, "all"),

        setBestSellers: (limit = 20) =>
            fetchProducts({ limit }, "best-sellers"),

        setCategory: (categoryId: number) =>
            fetchProducts({ categoryId }, "category"),
    };
}