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



    return (
        <HeroNavbar
            position="sticky"
            className="bg-gray-900 border-gray-700" // preguntarle a romario si esto le gusta o lo quito
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
                              {user.username ?? 'Usuario'}
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
                            <span className="font-medium text-white">
                              {user.username}
                            </span>
                          </DropdownItem>
                
                          {hasPermission ? (
                            <DropdownItem
                              key="settings"
                              startContent={
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                                  <Icon
                                    icon="solar:users-group-rounded-bold"
                                    className="text-sm text-indigo-400"
                                  />
                                </div>
                              }
                            >
                              <span className="text-white">Gestión de usuarios</span>
                            </DropdownItem>
                          ) : null}
                
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
                  )}
                </NavbarContent>
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