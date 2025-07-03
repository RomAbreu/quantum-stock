export type NewProductData = {
	name: string;
	description: string;
	category: string;
	price: number;
	quantity: number;
	minQuantity: number;
};

export type AddProductFormProps = {
	onSave?: (product: NewProductData) => Promise<void>;
	onCancel: () => void;
	categories?: string[];
	isLoading?: boolean;
};
