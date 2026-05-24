"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { productApi } from "@/lib/api/product.api";
import { ClientGetProductsQuery, Product } from "@/types";

type ProductSource = "all" | "best-sellers" | "category";
export function useProducts(initialParams: ClientGetProductsQuery = {}) {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sourceRef = useRef<ProductSource>("all");
    const paramsRef = useRef<ClientGetProductsQuery>(initialParams);

    const extractProducts = (res: any): Product[] => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    };

    const fetchProducts = useCallback(async (override?: ClientGetProductsQuery, newSource?: ProductSource) => {
        try {
            setLoading(true);
            setError(null);
            if (newSource) {
                sourceRef.current = newSource;
            }
            const finalSource = sourceRef.current;
            let query: ClientGetProductsQuery = {
                limit: 50,
                ...override,
            };
            if (finalSource === "all") {
                query = {
                    limit: 50,
                    ...override,
                };
                paramsRef.current = {};
            }

            if (finalSource === "category") {
                query = {
                    limit: 50,
                    ...override,
                };
            }
            let res: any;

            switch (finalSource) {
                case "best-sellers":
                    res = await productApi.getBestSellers(query.limit ?? 20);
                    break;

                case "category":
                    if (!query.categoryId) {
                        setData([]);
                        return;
                    }
                    res = await productApi.getByCategory(Number(query.categoryId));
                    break;

                default:
                    res = await productApi.getClientProducts(query);
                    break;
            }

            setData(extractProducts(res));
            paramsRef.current = query;
        } catch (err: any) {
            setError(err?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts({}, "all");
    }, [fetchProducts]);

    return {
        data,
        loading,
        error,
        refetch: fetchProducts,

        setAll: (params?: ClientGetProductsQuery) =>
            fetchProducts(params, "all"),

        setBestSellers: (limit = 20) =>
            fetchProducts({ limit }, "best-sellers"),

        setCategory: (categoryId: number) =>
            fetchProducts({ categoryId }, "category"),
    };
}