type FormErrorDisplayProps = {
	error: string | undefined;
};

export default function FormErrorDisplay({
	error,
}: Readonly<FormErrorDisplayProps>) {
	if (!error) return null;

	return (
		<div className="p-3 mb-4 text-white bg-red-500 rounded-md">{error}</div>
	);
}
