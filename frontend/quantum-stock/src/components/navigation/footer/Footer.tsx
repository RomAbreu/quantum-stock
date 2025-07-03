'use client';

import { Image, Link } from '@heroui/react';
import { EndpointEnum } from '@lib/constants/routes.constants';
import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-6 mt-auto bg-gray-900">
      <div className="container flex flex-col items-center px-4 mx-auto">
        {/* Centered Logo */}
        <Link href={EndpointEnum.Home} className="mb-4">
          <Image
            src="/images/logo.png"
            alt="QuantumStock Logo"
            className="w-auto h-16 drop-shadow-lg"
            width="auto"
            height={140}
            radius="none"
            classNames={{
              img: 'object-contain',
            }}
          />
        </Link>
        
        {/* Copyright Text */}
        <p className="text-sm text-center text-default-300">
          &copy; {CURRENT_YEAR} QuantumStock
        </p>
      </div>
    </footer>
  );
}