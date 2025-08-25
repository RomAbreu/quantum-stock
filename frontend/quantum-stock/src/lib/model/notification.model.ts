import type Product from './product.model';

export default interface MinQuantityNotification {
	id: number;
	product: Product;
	notificationDate: string;
}
