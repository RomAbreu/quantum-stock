'use client';

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
	NavbarProps,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { EndpointEnum } from '@lib/constants/routes.constants';
import { navbarItems } from '@lib/constants/navbar.constants';

export default function Navbar(props: Readonly<NavbarProps>) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { keycloak } = useKeycloak();

    const isAuthenticated = useMemo(() => {
        return keycloak.authenticated;
    }, [keycloak.authenticated]);

    const hasPermission = useMemo(() => {
        const roles = keycloak.resourceAccess?.['quantum-stock-frontend']?.roles;
        if (!roles) return false;

        return (
            roles.includes('admin') ||
            roles.includes('employee')
        );
    }, [keycloak.resourceAccess]);

    const user = {
        username: keycloak.tokenParsed?.preferred_username ?? 'Usuario',
    };

    const notificationCount = 3;

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
                {isAuthenticated && hasPermission && (
                    <>
                        {navbarItems.map((item) => (
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
                    </>
                )}
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
                                    redirectUri: window.location.origin + EndpointEnum.Home 
                                })
                            }
                            className="font-medium text-white bg-blue-600"
                            startContent={
                                <Icon
                                    icon="solar:login-2-bold"
                                    className="text-sm"
                                />
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
                                        onPress={() => keycloak.logout({ redirectUri: window.location.origin})}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 data-[hover=true]:bg-red-500/10"
                                    >
                                        <span>Cerrar sesión</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>

                        <NavbarItem>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button
                                        radius="md"
                                        variant="light"
                                        isIconOnly
                                        className="relative w-10 h-10 text-white transition-all duration-200 hover:bg-gray-700/90 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/70"
                                    >
                                        <div className="relative">
                                            <Icon
                                                icon="solar:bell-bing-bold"
                                                className="text-lg text-gray-300 transition-colors hover:text-white"
                                            />
                                            {notificationCount > 0 && (
                                                <div className="absolute flex items-center justify-center w-4 h-4 bg-blue-500 border border-gray-900 rounded-full shadow-lg -top-2 -right-2">
                                                    <span className="text-xs font-bold leading-none text-white">
                                                        {notificationCount > 9 ? '9+' : notificationCount}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Button>
                                </DropdownTrigger>
                        
                                <DropdownMenu
                                    aria-label="Notificaciones"
                                    className="p-2 text-gray-200 border-none rounded-lg shadow-xl w-80 bg-gray-900/95 backdrop-blur-md"
                                    itemClasses={{
                                        base: 'rounded-md hover:bg-gray-700/50 transition-colors duration-200 data-[hover=true]:bg-gray-700/50 p-3',
                                        title: 'text-sm font-medium',
                                        description: 'text-xs text-gray-400 mt-1',
                                    }}
                                >
                                    <DropdownItem
                                        key="header"
                                        className="p-3 border-b border-gray-700/50"
                                        textValue="Notificaciones"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-white">Notificaciones</h3>
                                            <span className="px-2 py-1 text-xs font-medium text-blue-400 rounded-full bg-blue-500/20">
                                                {notificationCount} nuevas
                                            </span>
                                        </div>
                                    </DropdownItem>
                        
                                    <DropdownItem
                                        key="notification1"
                                        className="p-3"
                                        textValue="Stock mínimo - iPhone 14"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 mt-1 rounded-full bg-yellow-500/20">
                                                <Icon
                                                    icon="solar:box-minimalistic-bold"
                                                    className="text-sm text-yellow-400"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Stock mínimo alcanzado</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    El producto <span className="font-medium text-yellow-400">iPhone 14 Pro</span> tiene solo 2 unidades restantes
                                                </p>
                                                <span className="block mt-1 text-xs text-gray-500">Hace 5 minutos</span>
                                            </div>
                                        </div>
                                    </DropdownItem>
                        
                                    <DropdownItem
                                        key="notification2"
                                        className="p-3"
                                        textValue="Stock mínimo - MacBook Air"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 mt-1 rounded-full bg-orange-500/20">
                                                <Icon
                                                    icon="solar:danger-triangle-bold"
                                                    className="text-sm text-orange-400"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Stock crítico</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    <span className="font-medium text-orange-400">MacBook Air M2</span> se encuentra sin stock disponible
                                                </p>
                                                <span className="block mt-1 text-xs text-gray-500">Hace 15 minutos</span>
                                            </div>
                                        </div>
                                    </DropdownItem>
                        
                                    <DropdownItem
                                        key="notification3"
                                        className="p-3"
                                        textValue="Stock mínimo - AirPods"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 mt-1 rounded-full bg-yellow-500/20">
                                                <Icon
                                                    icon="solar:box-minimalistic-bold"
                                                    className="text-sm text-yellow-400"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Stock bajo</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    <span className="font-medium text-yellow-400">AirPods Pro 2</span> tiene 3 unidades disponibles
                                                </p>
                                                <span className="block mt-1 text-xs text-gray-500">Hace 1 hora</span>
                                            </div>
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
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
                            onClick={() => keycloak.logout({ redirectUri: window.location.origin})}
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