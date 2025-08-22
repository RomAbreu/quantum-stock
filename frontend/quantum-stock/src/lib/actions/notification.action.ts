import type MinQuantityNotification from '@/lib/model/notification.model';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const fetchNotifications = async (
	token: string,
): Promise<MinQuantityNotification[]> => {
	const url = '/api/v1/min-quantity-notifications';
	const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

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
