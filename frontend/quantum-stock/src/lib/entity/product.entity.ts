export default interface Product {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	quantity: number;
	minQuantity?: number;
	createdAt?: string;
	updatedAt?: string;
}
