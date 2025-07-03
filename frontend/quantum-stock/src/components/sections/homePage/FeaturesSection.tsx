'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type Variants, motion } from 'framer-motion';

const features = [
	{
		icon: 'solar:box-minimalistic-bold-duotone', // or 'material-symbols:inventory-2'
		title: 'Product Management',
		description:
			'Easily add, edit, and view products with detailed information like name, category, and stock levels.',
		gradient: 'from-blue-500 to-cyan-500',
	},
	{
		icon: 'solar:chart-2-bold-duotone', // or 'material-symbols:analytics'
		title: 'Stock Control',
		description:
			'Stay on top of your inventory with real-time stock updates and minimum stock alerts.',
		gradient: 'from-green-500 to-emerald-500',
	},
	{
		icon: 'solar:programming-bold-duotone', // or 'material-symbols:api'
		title: 'API Integration',
		description:
			'Connect seamlessly with accounting or POS systems via our secure API.',
		gradient: 'from-purple-500 to-violet-500',
	},
	{
		icon: 'solar:monitor-bold-duotone', // or 'material-symbols:dashboard'
		title: 'User-Friendly Dashboard',
		description:
			'Get a clear overview of your inventory with intuitive analytics and insights.',
		gradient: 'from-orange-500 to-red-500',
	},
];

export default function FeaturesSection() {
	const containerVariants: Variants = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				duration: 0.8,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: {
			opacity: 0,
			y: 30,
		},
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.25, 0.46, 0.45, 0.94],
			},
		},
	};

	const cardHoverVariants: Variants = {
		hover: {
			scale: 1.05,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 20,
			},
		},
	};

	return (
		<section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="container px-4 mx-auto">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.2 }}
					className="text-center"
				>
					{/* Section Header */}
					<motion.div variants={itemVariants} className="mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-primary/10 border-primary/20">
							<Icon
								icon="solar:star-bold"
								className="text-primary"
								width={20}
							/>
							<span className="text-sm font-medium text-primary">
								Key Features
							</span>
						</div>

						<h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
							Powerful Features for{' '}
							<span className="text-primary">Modern Inventory</span>
						</h2>

						<p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 sm:text-xl">
							Discover how Quantum Stock revolutionizes inventory management
							with cutting-edge technology and intuitive design.
						</p>
					</motion.div>

					{/* Features Grid */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								variants={itemVariants}
								whileHover="hover"
							>
								<motion.div variants={cardHoverVariants}>
									<Card className="h-full transition-all duration-300 bg-white shadow-lg hover:shadow-xl border-gray-200/50">
										<CardBody className="p-8 text-center">
											{/* Icon with Gradient Background */}
											<div className="relative mx-auto mb-6 w-fit">
												<div
													className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20 blur-xl rounded-full scale-150`}
												/>
												<div
													className={`relative z-10 p-4 bg-gradient-to-r ${feature.gradient} bg-opacity-10 rounded-2xl`}
												>
													<Icon
														icon={feature.icon}
														className="mx-auto"
														width={48}
														height={48}
													/>
												</div>
											</div>

											{/* Content */}
											<h3 className="mb-4 text-xl font-bold text-gray-900">
												{feature.title}
											</h3>

											<p className="leading-relaxed text-gray-600">
												{feature.description}
											</p>

											{/* Hover Indicator */}
											<motion.div
												className={`w-0 h-1 bg-gradient-to-r ${feature.gradient} mx-auto mt-6 rounded-full`}
												whileHover={{
													width: '100%',
													transition: { duration: 0.3 },
												}}
											/>
										</CardBody>
									</Card>
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* Bottom CTA */}
					<motion.div variants={itemVariants} className="mt-16">
						<div className="p-8 bg-white border shadow-lg rounded-2xl border-gray-200/50">
							<div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
								<div className="text-center md:text-left">
									<h3 className="mb-2 text-2xl font-bold text-gray-900">
										Ready to Transform Your Inventory?
									</h3>
									<p className="text-gray-600">
										Join thousands of businesses using Quantum Stock for smarter
										inventory management.
									</p>
								</div>
								<div className="flex items-center gap-4">
									<div className="flex -space-x-2">
										{[
											'mdi:office-building',
											'mdi:store',
											'mdi:factory',
											'mdi:domain',
										].map((icon) => (
											<div
												key={icon}
												className="flex items-center justify-center w-10 h-10 border-2 border-white rounded-full bg-gradient-to-r from-primary to-primary-600"
											>
												<Icon
													icon={icon}
													className="text-white"
													width={16}
													height={16}
												/>
											</div>
										))}
									</div>
									<div className="text-sm text-gray-600">
										<div className="font-semibold">2,500+ Companies</div>
										<div>Trust Quantum Stock</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
