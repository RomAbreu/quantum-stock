import {
	Card,
	CardBody,
	CardHeader,
} from '@heroui/react';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type ChartData = {
	name: string;
	value: number;
	[key: string]: string | number;
};

type CircleChartProps = {
	title: string;
	color: string;
	categories: string[];
	chartData: ChartData[];
};

const formatTotal = (total: number) => {
	return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

const CircleChartCard = ({
	title,
	categories,
	color,
	chartData,
}: CircleChartProps) => {
	const colors = [
		'hsl(var(--heroui-primary))',
		'hsl(var(--heroui-secondary))',
		'hsl(var(--heroui-success))',
		'hsl(var(--heroui-warning))',
		'hsl(var(--heroui-danger))',
		'hsl(var(--heroui-default-400))',
	];

	return (
		<Card className="border border-transparent dark:border-default-100">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<div>
					<h3 className="font-medium text-small text-default-500">{title}</h3>
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex flex-wrap items-center justify-center h-full gap-x-4 lg:flex-nowrap">
					<ResponsiveContainer
						className="[&_.recharts-surface]:outline-none"
						height={280}
						width="60%"
					>
						<PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
							<Tooltip
								content={({ payload }) => (
									<div className="rounded-medium bg-background text-tiny shadow-small flex h-auto min-w-[140px] flex-col gap-y-2 p-3">
										{payload?.map((p, index) => (
											<div
												key={p.name || `payload-${index}`}
												className="flex items-center gap-x-2"
											>
												<div
													className="flex-none w-3 h-3 rounded-full"
													style={{
														backgroundColor: colors[index % colors.length],
													}}
												/>
												<div className="flex items-center justify-between w-full text-xs">
													<span className="font-medium text-default-600">
														{p.name}
													</span>
													<span className="ml-2 font-mono font-semibold text-foreground">
														{formatTotal(p.value as number)}
													</span>
												</div>
											</div>
										))}
									</div>
								)}
								cursor={false}
							/>
							<Pie
								data={chartData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								innerRadius="45%"
								paddingAngle={3}
								strokeWidth={0}
							>
								{chartData.map((entry, index) => (
									<Cell
										key={`cell-${entry.name}`}
										fill={colors[index % colors.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					<div className="flex flex-col justify-center w-full gap-3 p-4 text-small lg:p-0 lg:w-2/5">
						{categories.map((category, index) => {
							const dataPoint = chartData.find(
								(d) => d.name.toLowerCase() === category.toLowerCase(),
							);
							const value = dataPoint?.value || 0;
							const total = chartData.reduce(
								(sum, item) => sum + item.value,
								0,
							);
							const percentage =
								total > 0 ? ((value / total) * 100).toFixed(1) : '0';

							return (
								<div
									key={category}
									className="flex items-center justify-between min-w-0 gap-4"
								>
									<div className="flex items-center flex-shrink min-w-0 gap-2">
										<span
											className="flex-shrink-0 w-3 h-3 rounded-full"
											style={{ backgroundColor: colors[index % colors.length] }}
										/>
										<span className="font-medium truncate text-default-700">
											{category}
										</span>
									</div>
									<div className="text-right flex-shrink-0 min-w-[60px]">
										<div className="font-semibold text-foreground">
											{formatTotal(value)}
										</div>
										<div className="text-tiny text-default-500">
											{percentage}%
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default CircleChartCard;
