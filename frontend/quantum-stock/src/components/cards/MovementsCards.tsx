import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

type MovementsCardsProps = {
	title: string;
	value: string | number;
	change?: number;
	icon: string;
	color?: string;
};

const MovementsCards = ({
	title,
	value,
	change,
	icon,
	color = 'primary',
}: MovementsCardsProps) => (
	<Card className="border border-transparent dark:border-default-100">
		<CardBody className="flex flex-row items-center justify-between p-6 space-y-0">
			<div>
				<p className="text-sm font-medium text-default-500">{title}</p>
				<p className="text-2xl font-bold text-foreground">{value}</p>
			</div>
			<div className={`p-3 rounded-lg bg-${color}/10`}>
				<Icon icon={icon} className={`h-6 w-6 text-${color}`} />
			</div>
		</CardBody>
	</Card>
);

export default MovementsCards;
