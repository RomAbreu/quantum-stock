'use server';
import type InventoryMovement from '@/lib/model/movement.model';
import type Product from '@/lib/model/product.model';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

function transformMovement(apiMovement: any): InventoryMovement {
    const product: Product = {
        id: apiMovement.product?.id?.toString() || '',
        name: apiMovement.product?.name || 'Producto desconocido',
        description: apiMovement.product?.description || '',
        category: apiMovement.product?.category || 'Sin categoría',
        price: apiMovement.product?.price || 0,
        quantity: apiMovement.product?.quantity || 0,
        minQuantity: apiMovement.product?.minQuantity || 10,
    };

    return {
        id: apiMovement.id?.toString() || '',
        product: product,
        quantityChange: apiMovement.quantityChange || 0,
        type: apiMovement.type || 'OUT',
        user: apiMovement.user || 'Usuario desconocido',
        date: apiMovement.date || new Date().toISOString(),
    };
}

export async function getInventoryMovementsWithPagination(
    page: number,
    size: number,
    sort: string,
    searchTerm: string = '',
    typeFilter: string = 'all',
    token?: string
): Promise<{
    content: InventoryMovement[];
    totalElements: number;
    totalPages: number;
}> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
    });

    const url = `${API_BASE_URL}/api/v1/inventory-movements?${queryParams.toString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching inventory movements: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        let transformedContent: InventoryMovement[] = [];
        let totalElements = 0;
        let totalPages = 1;

        if (Array.isArray(data)) {
            transformedContent = data.map(transformMovement);
            totalElements = data.length;
            totalPages = Math.ceil(data.length / size) || 1;
        } else if (data.content && Array.isArray(data.content)) {
            transformedContent = data.content.map(transformMovement);
            totalElements = data.totalElements || data.content.length;
            totalPages = data.totalPages || Math.ceil(totalElements / size) || 1;
        }

        return {
            content: transformedContent,
            totalElements,
            totalPages,
        };
    } catch (error) {
        throw error;
    }
}