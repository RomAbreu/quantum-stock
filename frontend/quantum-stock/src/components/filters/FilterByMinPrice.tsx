'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type FilterByMinPriceProps = {
  label?: string;
  placeholder?: string;
};

export default function FilterByMinPrice({
  label = 'Precio Mínimo',
  placeholder = 'Precio mínimo...',
}: Readonly<FilterByMinPriceProps>) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState(searchParams.get('minPrice') ?? '');
  
  useEffect(() => {
    setValue(searchParams.get('minPrice') ?? '');
  }, [searchParams]);

  const updateURL = useDebouncedCallback((newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newValue && Number.parseFloat(newValue) > 0) {
      params.set('minPrice', newValue);
    } else {
      params.delete('minPrice');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 400);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateURL(newValue);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="min-price-filter" className="text-sm font-medium text-default-700">
        {label}
      </label>
      <Input
        id="min-price-filter"
        type="number"
        size="sm"
        variant="bordered"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        startContent={<Icon icon="lucide:dollar-sign" className="text-default-400" />}
        className="w-40 min-w-40"
        min={0}
        step="0.01"
      />
    </div>
  );
}