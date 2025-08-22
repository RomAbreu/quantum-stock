'use server';
import type InventoryMovement from '@/lib/model/movement.model';
import type Product from '@/lib/model/product.model';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

function transformMovement(apiMovement: InventoryMovement): InventoryMovement {
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
	token?: string,
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
			throw new Error(
				`Error fetching inventory movements: ${response.status} - ${errorText}`,
			);
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
		console.error('Failed to fetch inventory movements:', error);
		throw error;
	}
}

export async function getAllInventoryMovements(
    token?: string,
    limit?: number,
    dateRange?: { from: string; to: string }
): Promise<InventoryMovement[]> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams();
    
    if (limit) {
        queryParams.append('size', limit.toString());
    }
    
    if (dateRange) {
        queryParams.append('fromDate', dateRange.from);
        queryParams.append('toDate', dateRange.to);
    }

    const url = `${API_BASE_URL}/api/v1/inventory-movements`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'force-cache',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Error fetching all inventory movements: ${response.status} - ${errorText}`,
            );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            return data.map(transformMovement);
        } else if (data.content && Array.isArray(data.content)) {
            return data.content.map(transformMovement);
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch all inventory movements:', error);
        throw error;
    }
}