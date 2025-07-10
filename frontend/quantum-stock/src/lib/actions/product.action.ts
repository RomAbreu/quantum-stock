import type { NewProductData } from '@/components/forms/types/product.types';
import type Product from '@/lib/model/product.model';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

type ActionProps = {
    url?: string;
    product: Product;
    headers?: Record<string, string>;
};

export async function createProduct({
  url,
  product,
  headers
}: {
  url: string;
  product: NewProductData;
  headers: { Authorization: string };
}): Promise<Product> {
  const response = await fetch(`${url}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Error creating product');
  }

  return response.json();
}

export async function updateProduct({
  url = API_URL,
  product,
  headers
}: ActionProps): Promise<Product> {
  const response = await fetch(`${API_URL}/update/${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Error updating product');
  }

  return response.json();
}

export async function deleteProduct({
  productId,
  headers
}: {
  productId: string;
  headers: { Authorization: string };
}): Promise<void> {
  const response = await fetch(`${API_URL}/delete/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Error al eliminar el producto');
  }
}

