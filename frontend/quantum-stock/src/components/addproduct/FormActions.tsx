'use client';

import { Icon } from '@iconify/react';

type FormActionsProps = {
    onCancel: () => void;
    isLoading: boolean;
    submitting: boolean;
    isPending: boolean;
    isFormValid: boolean;
};

export default function FormActions({
    onCancel,
    isLoading,
    submitting,
    isPending,
    isFormValid,
}: Readonly<FormActionsProps>) {
    const isButtonDisabled = isLoading || submitting || isPending;

    return (
        <div className="flex justify-end gap-3 pt-4">
            <button
                type="button"
                onClick={onCancel}
                disabled={isButtonDisabled}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 border border-transparent rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Cancelar
            </button>
            
            <button
                type="submit"
                disabled={!isFormValid || isButtonDisabled}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[140px]"
            >
                {!isButtonDisabled && <Icon icon="lucide:save" className="w-4 h-4" />}
                {isButtonDisabled ? 'Guardando...' : 'Guardar Producto'}
            </button>
        </div>
    );
}