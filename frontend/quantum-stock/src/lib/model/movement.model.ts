import type Product from './product.model';

export default interface InventoryMovement {
	id: string;
	product: Product;
	quantityChange: number;
	type: 'IN' | 'OUT';
	user: string;
	date: string;
}
