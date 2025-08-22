import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import React from 'react';
import {
	Cell,
	PolarAngleAxis,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer,
} from 'recharts';

type ChartData = {
	name: string;
	value: number;
	fill?: string;
};

type RadialChartProps = {
	title: string;
	color: string;
	chartData: ChartData[];
	total: number;
};

const formatRadialTotal = (value: number | undefined) => {
	return value?.toLocaleString() ?? '0';
};

const RadialChartCard = ({
	title,
	color,
	chartData,
	total,
}: RadialChartProps) => {
	const stockValue = chartData?.[0]?.value || 0;
	const stockPercentage =
		total > 0 ? ((stockValue / total) * 100).toFixed(0) : '0';
	const isLowStock = stockValue / total < 0.3;

	return (
		<Card className="dark:border-default-100 h-[240px] border border-transparent">
			<CardHeader className="flex flex-col p-4 pb-0 gap-y-2">
				<div className="flex items-center justify-between w-full gap-x-2">
					<h3 className="font-medium text-small text-default-500">{title}</h3>
					<div className="flex items-center justify-end gap-x-2">
						{isLowStock && (
							<Chip color="danger" size="sm" variant="flat">
								<span className="ml-1">Bajo</span>
							</Chip>
						)}
					</div>
				</div>
			</CardHeader>
			<CardBody className="pt-0">
				<ResponsiveContainer
					className="[&_.recharts-surface]:outline-none"
					height="100%"
					width="100%"
				>
					<RadialBarChart
						barSize={12}
						cx="50%"
						cy="50%"
						data={chartData}
						endAngle={-270}
						innerRadius={65}
						outerRadius={85}
						startAngle={90}
					>
						<PolarAngleAxis
							angleAxisId={0}
							domain={[0, total]}
							tick={false}
							type="number"
						/>
						<RadialBar
							angleAxisId={0}
							background={{
								fill: 'hsl(var(--heroui-default-100))',
							}}
							cornerRadius={8}
							dataKey="value"
						>
							{chartData.map((entry) => (
								<Cell
									key={`cell-${entry.name}`}
									fill={
										isLowStock
											? 'hsl(var(--heroui-danger))'
											: `hsl(var(--heroui-${color === 'default' ? 'foreground' : color}))`
									}
								/>
							))}
						</RadialBar>
						<g>
							<text textAnchor="middle" x="50%" y="45%">
								<tspan
									className="fill-default-500 text-tiny"
									dy="-0.5em"
									x="50%"
								>
									Stock Actual
								</tspan>
								<tspan
									className={`font-bold text-large ${isLowStock ? 'fill-danger' : 'fill-foreground'}`}
									dy="1.2em"
									x="50%"
								>
									{formatRadialTotal(stockValue)}
								</tspan>
								<tspan
									className="fill-default-400 text-tiny"
									dy="1.2em"
									x="50%"
								>
									de {formatRadialTotal(total)} ({stockPercentage}%)
								</tspan>
							</text>
						</g>
					</RadialBarChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
};

export default RadialChartCard;
