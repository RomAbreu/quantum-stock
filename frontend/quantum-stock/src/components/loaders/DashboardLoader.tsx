import React from 'react';

const DashboardLoader = () => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="space-y-4 text-center">
				<div className="w-12 h-12 mx-auto border-4 rounded-full border-primary-200 border-t-primary animate-spin" />
				<p className="text-default-500">Cargando datos del inventario...</p>
			</div>
		</div>
	);
};

export default DashboardLoader;
