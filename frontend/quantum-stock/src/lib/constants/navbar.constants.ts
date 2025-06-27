export type NavbarLink = {
	label: string;
	href: string;
	icon?: React.ReactNode;
	showInNavbar?: boolean;
};

export enum NavbarLinks {
	HOME = '/',
	LOGIN = '/auth/login',
	SIGNUP = '/auth/signup',
	DASHBOARD = '/dashboard',
	STOCK = '/stock',
}

export const NAVBAR_ITEMS: NavbarLink[] = [
	{
		label: 'Home',
		href: NavbarLinks.HOME,
	},
	{
		label: 'Dashboard',
		href: NavbarLinks.DASHBOARD,
	},
	{
		label: 'Stock',
		href: NavbarLinks.STOCK,
	},
	{
		label: 'Login',
		href: NavbarLinks.LOGIN,
	},
	{
		label: 'Sign Up',
		href: NavbarLinks.SIGNUP,
	},
];
