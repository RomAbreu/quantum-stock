import { API_URL } from '@lib/constants/api.constants';
import { EndpointEnum } from '@/lib/constants/routes.constants';
import Method from '@lib/data/method.data';
import type Product from '@lib/entity/product.entity';

const PRODUCT_ENDPOINT = EndpointEnum.Products;
const CURRENT_PATH = `${API_URL}${PRODUCT_ENDPOINT}/all`;

export const getProducts = async (
	token: string,
): Promise<Product[] | Error> => {
	try {
		const response = await fetch(CURRENT_PATH, {
			method: Method.GET,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		const products = await response.json();
		return products;
	} catch (error) {
		return error instanceof Error ? error : new Error('Unknown error occurred');
	}
};
