export type NewProductData = {
	name: string;
	description: string;
	category: string;
	price: number;
	initialQuantity: number;
	minQuantity: number;
};

export type AddProductFormProps = {
	onSave?: (product: NewProductData) => Promise<void>;
	onCancel: () => void;
	categories?: string[];
	isLoading?: boolean;
};
