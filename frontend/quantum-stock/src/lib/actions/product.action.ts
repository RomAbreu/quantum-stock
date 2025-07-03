'use server';

import { API_URL } from '@lib/constants/api.constants';
import { EndpointEnum } from '@/lib/constants/routes.constants';
import Method from '@lib/data/method.data';
import Routes from '@lib/data/routes.data';
import { revalidatePath } from 'next/cache';

const PRODUCT_ENDPOINT = EndpointEnum.Products;
const CURRENT_PATH = `${API_URL}${PRODUCT_ENDPOINT}`;
const CREATE_PATH = `${CURRENT_PATH}/create`;
const UPDATE_PATH = `${CURRENT_PATH}/update/`;
const DELETE_PATH = `${CURRENT_PATH}/delete/`;

export async function createProduct(
	prevState: unknown,
	{ formData, token }: { formData: FormData; token: string },
) {
	try {
		if (!token) {
			throw new Error('No estás autenticado');
		}

		const product = Object.fromEntries(formData.entries());
		const productDTO = {
			name: product.name,
			description: product.description,
			category: product.category,
			price: product.price,
			quantity: product.quantity,
			minQuantity: product.minQuantity,
		};

		const response = await fetch(CREATE_PATH, {
			method: Method.POST,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(productDTO),
		});

		if (!response.ok) {
			const errorText = await response.text();

			try {
				const errorData = JSON.parse(errorText);
				throw new Error(
					errorData?.message ??
						`Error ${response.status}: No se pudo crear el producto`,
				);
			} catch (e) {
				throw new Error(
					`Error ${response.status}: No se pudo crear el producto`,
				);
			}
		}

		const result = await response.json();
		revalidatePath(Routes.Stock);
		return { success: true, product: result };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				errors: {
					createProduct: error.message,
				},
			};
		}

		return {
			errors: {
				createProduct: 'Ha ocurrido un error al crear el producto',
			},
		};
	}
}

export async function updateProduct(
	prevState: unknown,
	{ formData, token }: { formData: FormData; token: string },
) {
	try {
		if (!token) {
			throw new Error('No estás autenticado');
		}

		const product = Object.fromEntries(formData.entries());
		const productDTO = {
			id: product.id,
			name: product.name,
			description: product.description,
			category: product.category,
			price: product.price,
			quantity: product.quantity,
			minQuantity: product.minQuantity,
		};

		const response = await fetch(`${UPDATE_PATH}${product.id}`, {
			method: Method.PUT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(productDTO),
		});

		if (!response.ok) {
			const errorText = await response.text();

			try {
				const errorData = JSON.parse(errorText);
				throw new Error(
					errorData?.message ??
						`Error ${response.status}: No se pudo actualizar el producto`,
				);
			} catch (e) {
				throw new Error(
					`Error ${response.status}: No se pudo actualizar el producto`,
				);
			}
		}

		const result = await response.json();
		revalidatePath(Routes.Stock);
		return { success: true, product: result };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				errors: {
					updateProduct: error.message,
				},
			};
		}

		return {
			errors: {
				updateProduct: 'Ha ocurrido un error al actualizar el producto',
			},
		};
	}
}

export async function deleteProduct(
	prevState: unknown,
	{ id, token }: { id: string; token: string },
) {
	try {
		if (!token) {
			throw new Error('No estás autenticado');
		}

		const response = await fetch(`${DELETE_PATH}${id}`, {
			method: Method.DELETE,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();

			try {
				const errorData = JSON.parse(errorText);
				throw new Error(
					errorData?.message ??
						`Error ${response.status}: No se pudo eliminar el producto`,
				);
			} catch (e) {
				throw new Error(
					`Error ${response.status}: No se pudo eliminar el producto`,
				);
			}
		}

		revalidatePath(Routes.Stock);
		return { success: true };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				errors: {
					deleteProduct: error.message,
				},
			};
		}

		return {
			errors: {
				deleteProduct: 'Ha ocurrido un error al eliminar el producto',
			},
		};
	}
}
