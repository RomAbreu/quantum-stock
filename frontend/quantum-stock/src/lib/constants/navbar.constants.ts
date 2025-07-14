import { EndpointEnum } from "./routes.constants";

interface NavbarLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

export const navbarItems: NavbarLink[] = [
    { 
        label: 'Stock', 
        href: EndpointEnum.Stock, 
    },
    { 
        label: 'Dashboard', 
        href: EndpointEnum.Dashboard, 
    },
];