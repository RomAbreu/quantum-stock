'use client';

import { useInventoryMovements } from '@/lib/hooks/useMovement';
import { Autocomplete, AutocompleteItem, Button, Chip, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeycloak } from '@react-keycloak/web';
import React, { useState, useEffect, useMemo } from 'react';

import DashboardLoader from '@/components/loaders/DashboardLoader';
import { EndpointEnum } from '@/lib/constants/routes.constants';

export default function MovementsPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { movements, isLoading, refetch } = useInventoryMovements();
  const { keycloak, initialized } = useKeycloak();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const hasPermission = useMemo(() => {
    const roles = keycloak.resourceAccess?.['quantum-stock-frontend']?.roles || [];
    return roles.includes('admin') || roles.includes('employee');
  }, [keycloak.resourceAccess]);

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/movements');

      keycloak.login({
        redirectUri: `${window.location.origin}/movements`,
      });
    } else if (initialized && keycloak.authenticated && !hasPermission) {
      window.location.href = EndpointEnum.Home;
    }
  }, [initialized, keycloak, hasPermission]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredMovements = useMemo(() => {
    return movements.filter(movement => {
      const matchesSearch = 
        movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.user.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        typeFilter === 'all' || 
        movement.type === typeFilter;
        
      return matchesSearch && matchesType;
    });
  }, [movements, searchTerm, typeFilter]);

  const pages = Math.ceil(filteredMovements.length / rowsPerPage);
  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredMovements.slice(start, end);
  }, [filteredMovements, currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!initialized || initialLoading || isLoading) {
    return <DashboardLoader />;
  }

  if (initialized && !keycloak.authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Acceso restringido</h1>
          <p className="mb-4 text-default-500">
            Necesitas iniciar sesión para ver los movimientos de inventario.
          </p>
          <Button
            color="primary"
            onPress={() =>
              keycloak.login({
                redirectUri: `${window.location.origin}/movements`,
              })
            }
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (initialized && keycloak.authenticated && !hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Acceso no autorizado</h1>
          <p className="mb-4 text-default-500">
            No tienes permisos suficientes para ver los movimientos de inventario.
          </p>
          <Button
            color="primary"
            onPress={() => {
              window.location.href = EndpointEnum.Home;
            }}
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Movimientos de Inventario
            </h1>
            <p className="mt-1 text-default-500">
              Historial de entradas y salidas de productos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="primary"
              startContent={
                <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
              }
              onPress={() => refetch()}
            >
              Actualizar Datos
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Buscar por producto o usuario..."
              startContent={<Icon icon="lucide:search" className="w-4 h-4" />}
              value={searchTerm}
              onValueChange={setSearchTerm}
              isClearable
              classNames={{
                inputWrapper: "bg-content1",
              }}
            />
          </div>
        <div className="flex items-center gap-3">
          <Autocomplete
            label="Tipo de movimiento"
            placeholder="Selecciona un tipo"
            defaultSelectedKey={typeFilter}
            onSelectionChange={(key) => setTypeFilter(key as string)}
            className="w-64"
            classNames={{
              base: "max-w-xs",
              listboxWrapper: "max-h-[200px]",
              selectorButton: "bg-content1",
            }}
          >
            <AutocompleteItem key="all">
              Todos los movimientos
            </AutocompleteItem>
            <AutocompleteItem key="IN" startContent={<Icon icon="lucide:arrow-down-right" className="w-4 h-4 text-success" />}>
              Entradas
            </AutocompleteItem>
            <AutocompleteItem key="OUT" startContent={<Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-danger" />}>
              Salidas
            </AutocompleteItem>
          </Autocomplete>
        </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            aria-label="Tabla de movimientos de inventario"
            classNames={{
              wrapper: "shadow-sm rounded-lg overflow-hidden bg-content1",
              th: "bg-content2 text-default-600",
            }}
          >
            <TableHeader>
              <TableColumn>PRODUCTO</TableColumn>
              <TableColumn>TIPO</TableColumn>
              <TableColumn>CANTIDAD</TableColumn>
              <TableColumn>USUARIO</TableColumn>
              <TableColumn>FECHA</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No hay movimientos para mostrar">
              {paginatedMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{movement.product.name}</span>
                      <span className="text-xs text-default-500">ID: {movement.product.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {movement.type === 'IN' ? (
                      <Chip color="success" variant="flat">Entrada</Chip>
                    ) : (
                      <Chip color="danger" variant="flat">Salida</Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${movement.type === 'IN' ? 'text-success' : 'text-danger'}`}>
                      {movement.type === 'IN' ? '+' : '-'}{Math.abs(movement.quantityChange)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:user" className="w-4 h-4" />
                      <span>{movement.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(movement.date)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              total={pages}
              page={currentPage}
              onChange={setCurrentPage}
              showControls
              variant="bordered"
              color="primary"
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-6 rounded-lg shadow-sm bg-content1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary-50">
                <Icon icon="lucide:database" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-default-500">Total de Movimientos</p>
                <h3 className="text-2xl font-bold">{movements.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg shadow-sm bg-content1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success-50">
                <Icon icon="lucide:arrow-down-right" className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-default-500">Entradas</p>
                <h3 className="text-2xl font-bold">{movements.filter(m => m.type === 'IN').length}</h3>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg shadow-sm bg-content1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-danger-50">
                <Icon icon="lucide:arrow-up-right" className="w-6 h-6 text-danger" />
              </div>
              <div>
                <p className="text-sm text-default-500">Salidas</p>
                <h3 className="text-2xl font-bold">{movements.filter(m => m.type === 'OUT').length}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}