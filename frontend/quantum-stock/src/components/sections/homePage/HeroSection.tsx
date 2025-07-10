'use client';

import { Button, Image, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type Variants, motion } from 'framer-motion';
import { EndpointEnum } from '@lib/constants/routes.constants';
import { useKeycloak } from '@react-keycloak/web';
import { useMemo } from 'react';

export default function HeroSection() {
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

    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier curve
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const floatingVariants: Variants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
            },
        },
    };

    const glowVariants: Variants = {
        initial: {
            scale: 0.75,
            opacity: 0.3,
        },
        animate: {
            scale: [0.75, 0.85, 0.75],
            opacity: [0.3, 0.5, 0.3],
            transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
            },
        },
    };

    // Simplified welcome view for authenticated users without proper permissions
    if (isAuthenticated && !hasPermission) {
        return (
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center px-4 mt-20 text-center text-white sm:px-6 lg:px-8 gap-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Floating Icon with Enhanced Glow */}
                <motion.div variants={itemVariants} className="relative">
                    <motion.div
                        variants={floatingVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <Image
                            src="/images/logo_no_letters.png"
                            alt="Quantum Stock Logo"
                            className="w-auto h-8"
                            width="auto"
                            height={250}
                            radius="none"
                            classNames={{
                                img: 'object-contain',
                            }}
                        />
                    </motion.div>

                    {/* Enhanced Glow Effects */}
                    <motion.div
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 rounded-full blur-xl bg-primary"
                    />
                    <div className="absolute inset-0 scale-50 rounded-full blur-2xl opacity-20 bg-primary animate-pulse" />
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
                >
                    Quantum{' '}
                    <motion.span
                        className="text-primary"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        Stock
                    </motion.span>
                </motion.h1>

                {/* Welcome message */}
                <motion.p
                    variants={itemVariants}
                    className="max-w-4xl mx-auto mt-2 text-lg leading-relaxed sm:text-xl md:text-2xl text-white/90 drop-shadow-lg"
                >
                    Bienvenido a{' '}
                    <span className="font-semibold text-primary-300">
                        Quantum Stock
                    </span>
                </motion.p>
            </motion.div>
        );
    }

    // Full hero section for unauthenticated users or users with proper permissions
    return (
        <motion.div
            className="relative z-10 flex flex-col items-center justify-center px-4 mt-20 text-center text-white sm:px-6 lg:px-8 gap-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Floating Icon with Enhanced Glow */}
            <motion.div variants={itemVariants} className="relative">
                <motion.div
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                >
                    <Image
                        src="/images/logo_no_letters.png"
                        alt="Quantum Stock Logo"
                        className="w-auto h-8"
                        width="auto"
                        height={250}
                        radius="none"
                        classNames={{
                            img: 'object-contain',
                        }}
                    />
                </motion.div>

                {/* Enhanced Glow Effects */}
                <motion.div
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 rounded-full blur-xl bg-primary"
                />
                <div className="absolute inset-0 scale-50 rounded-full blur-2xl opacity-20 bg-primary animate-pulse" />
            </motion.div>

            {/* Enhanced Badge */}
            <motion.div variants={itemVariants}>
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 transition-colors duration-300 border rounded-full bg-primary/20 backdrop-blur-sm border-primary/30 hover:bg-primary/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Icon
                        icon="solar:verified-check-bold"
                        className="text-primary"
                        width={20}
                    />
                    <span className="text-sm font-medium text-primary-100">
                        Sistema de Inventarios Inteligente
                    </span>
                </motion.div>
            </motion.div>

            {/* Enhanced Main Title */}
            <motion.h1
                variants={itemVariants}
                className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
            >
                Quantum{' '}
                <motion.span
                    className="text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    Stock
                </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
                variants={itemVariants}
                className="max-w-4xl mx-auto mt-2 text-lg leading-relaxed sm:text-xl md:text-2xl text-white/90 drop-shadow-lg"
            >
                Revoluciona la gestión de tu inventario con{' '}
                <span className="font-semibold text-primary-300">
                    precisión cuántica
                </span>{' '}
                . Optimiza, analiza y controla tu stock con inteligencia artificial y
                análisis predictivo en tiempo real.
            </motion.p>
        </motion.div>
    );
}