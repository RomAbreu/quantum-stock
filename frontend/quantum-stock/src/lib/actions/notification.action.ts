import type MinQuantityNotification from '@/lib/model/notification.model';

const API_URL= process.env.NEXT_PUBLIC_API_URL;

export const fetchNotifications = async (
	token: string,
): Promise<MinQuantityNotification[]> => {
	const url = '/min-quantity-notifications';
	const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

	const response = await fetch(fullUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};
