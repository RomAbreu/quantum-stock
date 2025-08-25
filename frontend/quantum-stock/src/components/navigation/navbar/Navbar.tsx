'use client';

import { useNotifications } from '@/lib/hooks/useNotifications';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar as HeroNavbar,
    Image,
    Link,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    type NavbarProps,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { navbarItems } from '@lib/constants/navbar.constants';
import { EndpointEnum } from '@lib/constants/routes.constants';
import { useKeycloak } from '@react-keycloak/web';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Navbar(props: Readonly<NavbarProps>) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { keycloak } = useKeycloak();
    const { notifications, isLoading } = useNotifications();
    const [showNotificationHighlight, setShowNotificationHighlight] =
        useState(false);

    const isAuthenticated = useMemo(() => {
        return keycloak.authenticated;
    }, [keycloak.authenticated]);

    const hasPermission = useMemo(() => {
        const roles = keycloak.resourceAccess?.['quantum-stock-frontend']?.roles;
        if (!roles) return false;

        return roles.includes('admin') || roles.includes('employee');
    }, [keycloak.resourceAccess]);

    const displayNavItems = useMemo(() => {
        if (!isAuthenticated) {
            return navbarItems.filter(
                (item) =>
                    item.href.includes('stock')
            );
        }
        return navbarItems;
    }, [isAuthenticated]);

    useEffect(() => {
        if (notifications.length > 0) {
            setShowNotificationHighlight(true);
            const timer = setTimeout(() => {
                setShowNotificationHighlight(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notifications]);

    const user = {
        username: keycloak.tokenParsed?.preferred_username ?? 'Usuario',
    };

    const getTimeAgo = useCallback((dateString: string): string => {
        const diffInSeconds = Math.floor(
            (Date.now() - new Date(dateString).getTime()) / 1000,
        );

        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 1) return 'Ahora mismo';

        const hours = Math.floor(minutes / 60);
        if (hours < 1) return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;

        const days = Math.floor(hours / 24);
        if (days < 1) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;

        return `Hace ${days} día${days !== 1 ? 's' : ''}`;
    }, []);

    const processedNotifications = useMemo(() => {
        return notifications.map((notification) => {
            const timeAgo = getTimeAgo(notification.notificationDate);
            const isOutOfStock = notification.product.quantity === 0;

            return {
                id: notification.id,
                type: isOutOfStock ? 'critical' : 'warning',
                title: isOutOfStock ? 'Stock crítico' : 'Stock mínimo alcanzado',
                message: isOutOfStock
                    ? `${notification.product.name} se encuentra sin stock disponible`
                    : `${notification.product.name} tiene solo ${notification.product.quantity} unidad${notification.product.quantity !== 1 ? 'es' : ''} restante${notification.product.quantity !== 1 ? 's' : ''}`,
                icon: isOutOfStock
                    ? 'solar:danger-triangle-bold'
                    : 'solar:box-minimalistic-bold',
                color: isOutOfStock ? 'orange' : 'yellow',
                time: timeAgo,
                productName: notification.product.name,
            };
        });
    }, [notifications, getTimeAgo]);

    const notificationCount = processedNotifications.length;

    return (
        <HeroNavbar
            position="sticky"
            className="bg-gray-900 border-gray-700"
            classNames={{
                wrapper: 'bg-gray-900',
                content: 'text-white',
                brand: 'text-white',
                item: 'text-white data-[active=true]:text-white',
                toggle: 'text-white',
                menu: 'bg-gray-900 border-gray-700',
            }}
            isBordered
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    className="sm:hidden"
                />

                <NavbarBrand as={Link} href={EndpointEnum.Home}>
                    <Image
                        src="/images/banner_sin_fondo.png"
                        alt="Quantum Stock Logo"
                        width={70}
                        height={70}
                        className="rounded-full"
                    />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex" justify="center">
                {displayNavItems.map((item) => (
                    <NavbarItem key={item.label}>
                        <Link
                            href={item.href}
                            className="flex items-center gap-1 px-3 py-1.5 transition-all duration-200 hover:scale-105 hover:bg-gray-800/60 rounded-lg"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent className="hidden sm:flex" justify="end">
                {!isAuthenticated ? (
                    <NavbarItem>
                        <Button
                            radius="full"
                            variant="flat"
                            color="primary"
                            onPress={() =>
                                keycloak.login({
                                    redirectUri: window.location.origin + EndpointEnum.Home,
                                })
                            }
                            className="font-medium text-white bg-blue-600"
                            startContent={
                                <Icon icon="solar:login-2-bold" className="text-sm" />
                            }
                        >
                            Iniciar sesión
                        </Button>
                    </NavbarItem>
                ) : (
                    <>
                        <NavbarItem>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button
                                        radius="full"
                                        variant="light"
                                        className="h-10 px-3 text-white transition-all duration-200 hover:bg-gray-700/90 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/70"
                                        startContent={
                                            <div className="flex items-center justify-center rounded-full w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-blue-400/20">
                                                <Icon
                                                    icon="solar:user-bold"
                                                    className="text-xs text-white"
                                                />
                                            </div>
                                        }
                                    >
                                        <span className="text-sm font-medium truncate max-w-24">
                                            {user.username?.split('@')[0] ?? 'Usuario'}
                                        </span>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Acciones de perfil"
                                    className="w-56 p-2 text-gray-200 border-none rounded-lg shadow-xl bg-gray-900/95 backdrop-blur-md"
                                    itemClasses={{
                                        base: 'rounded-md hover:bg-gray-700/50 transition-colors duration-200 data-[hover=true]:bg-gray-700/50',
                                        title: 'text-sm font-medium',
                                        description: 'text-xs text-gray-400',
                                    }}
                                >
                                    <DropdownItem
                                        key="profile"
                                        startContent={
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
                                                <Icon
                                                    icon="solar:user-circle-bold"
                                                    className="text-sm text-blue-400"
                                                />
                                            </div>
                                        }
                                    >
                                        <span className="text-sm font-medium truncate max-w-24">
                                            {user.username?.split('@')[0] ?? 'Usuario'}
                                        </span>
                                    </DropdownItem>

                                    <DropdownItem key="divider" className="p-0 my-1">
                                        <div className="w-full h-px bg-gray-700/50" />
                                    </DropdownItem>

                                    <DropdownItem
                                        key="logout"
                                        startContent={
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                                                <Icon
                                                    icon="solar:logout-2-bold"
                                                    className="text-sm text-red-400"
                                                />
                                            </div>
                                        }
                                        onPress={() =>
                                            keycloak.logout({ redirectUri: window.location.origin })
                                        }
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 data-[hover=true]:bg-red-500/10"
                                    >
                                        <span>Cerrar sesión</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>

                        {hasPermission && (
                            <NavbarItem>
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Button
                                            radius="md"
                                            variant="light"
                                            isIconOnly
                                            className="relative w-10 h-10 text-white transition-all duration-200 hover:bg-gray-700/90 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/70"
                                            isLoading={isLoading}
                                        >
                                            <div className="relative">
                                                <Icon
                                                    icon="solar:bell-bing-bold"
                                                    className="text-lg text-gray-300 transition-colors hover:text-white"
                                                />
                                                {notificationCount > 0 ? (
                                                    <div className="absolute flex items-center justify-center w-4 h-4 bg-blue-500 border border-gray-900 rounded-full shadow-lg -top-2 -right-2 animate-pulse">
                                                        <span className="text-xs font-bold leading-none text-white">
                                                            {notificationCount > 9 ? '9+' : notificationCount}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
											aria-label="Notificaciones"
											className="p-2 overflow-y-auto text-gray-200 border-none rounded-lg shadow-xl w-80 bg-gray-900/95 backdrop-blur-md max-h-96"
											itemClasses={{
												base: 'rounded-md hover:bg-gray-700/50 transition-colors duration-200 data-[hover=true]:bg-gray-700/50 p-3',
												title: 'text-sm font-medium',
												description: 'text-xs text-gray-400 mt-1',
											}} children={null}                                    >
                                    </DropdownMenu>
                                </Dropdown>
                            </NavbarItem>
                        )}
                    </>
                )}
            </NavbarContent>

            <NavbarMenu>
                {!isAuthenticated ? (
                    <>
                        <NavbarMenuItem>
                            <Link href={EndpointEnum.Login}>Login</Link>
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link href={EndpointEnum.Login}>Register</Link>
                        </NavbarMenuItem>
                    </>
                ) : (
                    <NavbarMenuItem>
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-danger"
                            onClick={() =>
                                keycloak.logout({ redirectUri: window.location.origin })
                            }
                        >
                            <Icon icon="solar:logout-2-linear" />
                            Logout
                        </Link>
                    </NavbarMenuItem>
                )}
            </NavbarMenu>
        </HeroNavbar>
    );
}