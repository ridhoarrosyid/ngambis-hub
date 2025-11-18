import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    city?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Interface untuk data Testimonial Card
export interface Testimonial {
    id: number;
    name: string;
    message: string;
    role: string;
}

export interface UserAppliedList {
    id: number;
    status: string; // 'applied', 'accepted', 'rejected'
    user: User; // Data user yang melamar
}

// 1. Type untuk Position (Child)
export interface Position {
    id: number;
    project_id: number;
    name: string;
    responsibility: string;
    user_applied_list: UserAppliedList[];
    created_at: string; // Laravel mengirim tanggal sebagai ISO String
    updated_at: string;
    current_application?: CurrentUserApplication | null;
}

export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

// 2. Type untuk Project (Parent)
export interface Project {
    id: number;
    user_id: number;
    category_id: number;
    category: Category;
    name: string;
    description: string | null; // Bisa null sesuai migration sebelumnya
    image: string | null; // Bisa null sesuai migration sebelumnya
    positions: Position[]; // Array of Position
    user: User;
    created_at: string;
}

// 3. Type untuk Link Pagination (Laravel Standard)
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    page?: number | null; // Custom field jika ada
}

// 4. Type Generic untuk Response Pagination Laravel
// Menggunakan <T> agar bisa dipakai untuk User, Category, dll nantinya.
export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

// 5. Type Spesifik untuk Halaman Project
export type ProjectsResponse = PaginatedResponse<Project>;

export type ApplicationStatus = 'applied' | 'accepted' | 'rejected';

export interface CurrentUserApplication {
    id: number;
    status: ApplicationStatus;
    created_at: string;
}
