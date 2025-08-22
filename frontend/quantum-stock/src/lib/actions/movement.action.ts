'use server';

import type InventoryMovement from '@/lib/model/movement.model';
import type Product from '@/lib/model/product.model';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

function transformMovement(apiMovement: InventoryMovement): InventoryMovement {
	const product: Product = {
		id: apiMovement.product.id,
		name: apiMovement.product.name,
		description: apiMovement.product.description,
		category: apiMovement.product.category || 'Sin categoría',
		price: apiMovement.product.price,
		quantity: apiMovement.product.quantity,
		minQuantity: apiMovement.product.minQuantity || 10,
	};

	return {
		id: apiMovement.id.toString(),
		product: product,
		quantityChange: apiMovement.quantityChange || 0,
		type: apiMovement.type,
		user: apiMovement.user,
		date: apiMovement.date,
	};
}

export async function getAllInventoryMovements(
	token?: string,
): Promise<InventoryMovement[]> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}/api/v1/inventory-movements`, {
		method: 'GET',
		headers,
		cache: 'no-store',
	});

	if (!response.ok) {
		console.error('Error en la respuesta HTTP:', response.statusText);
		throw new Error(`Error fetching inventory movements: ${response.status}`);
	}

	const apiData = await response.json();

	const transformedData = apiData.map(transformMovement);

	return transformedData;
}
