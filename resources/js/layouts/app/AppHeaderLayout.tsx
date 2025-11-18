// src/components/Navbar.tsx

import { index as indexApply } from '@/actions/App/Http/Controllers/ApplyController';
import { index as indexProject } from '@/actions/App/Http/Controllers/ProjectContorller';
import { login, register } from '@/routes'; // Pastikan ada route logout jika menggunakan wayfinder, atau gunakan manual url
import { RouteDefinition } from '@/wayfinder';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, User as UserIcon } from 'lucide-react';

// Komponen UI Shadcn
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// --- DEFINISI TYPE/INTERFACE ---
interface NavLink {
    name: string;
    href: RouteDefinition<'get'> | string;
}

interface User {
    id: number;
    name: string;
    email: string;
    image?: string | null; // Sesuaikan dengan database Anda (image/avatar)
}

// Data tautan navigasi
const navLinks: NavLink[] = [
    { name: 'Beranda', href: '/' },
    { name: 'Applied Position', href: indexApply() },
    { name: 'My Project', href: indexProject() },
];

// --- KOMPONEN UTAMA ---
export function AppHeaderLayout() {
    // Mengambil data user dari Props Inertia (Laravel Shared Props)
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth.user;

    // Helper untuk inisial nama
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    // Handle Logout
    const handleLogout = () => {
        router.post('/logout'); // Sesuaikan route logout Anda (standar Laravel '/logout')
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo/Nama Aplikasi */}
                <a href="/" className="text-2xl font-bold tracking-wider text-blue-600">
                    Ngambishub
                </a>

                {/* Navigasi Desktop */}
                <nav className="hidden items-center space-x-6 md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
                            {link.name}
                        </Link>
                    ))}

                    {/* KONDISIONAL AUTH DESKTOP */}
                    {user ? (
                        // JIKA LOGIN: Tampilkan Avatar Dropdown
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border shadow-sm">
                                        <AvatarImage src={user.image || ''} alt={user.name} />
                                        <AvatarFallback className="bg-blue-100 font-bold text-blue-700">{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm leading-none font-medium">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Profile Saya
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        // JIKA BELUM LOGIN: Tampilkan Tombol Masuk/Daftar
                        <div className="flex items-center space-x-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href={login()}>Masuk</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={register()}>Daftar</Link>
                            </Button>
                        </div>
                    )}
                </nav>

                {/* Menu Mobile (Hamburger) */}
                <div className="md:hidden">
                    <MobileNav user={user} onLogout={handleLogout} />
                </div>
            </div>
        </header>
    );
}

// --- KOMPONEN MOBILE NAV ---
// Props: menerima user dan fungsi logout
function MobileNav({ user, onLogout }: { user: User | null; onLogout: () => void }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Toggle Menu">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 pt-6">
                    {/* Logo di menu mobile */}
                    <a href="/" className="mb-4 text-xl font-bold tracking-wider text-blue-600">
                        Ngambishub
                    </a>

                    {/* Profil Mobile jika Login */}
                    {user && (
                        <div className="mb-2 flex items-center space-x-3 border-b pb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.image || ''} />
                                <AvatarFallback className="bg-blue-100 text-blue-700">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-bold">{user.name}</p>
                                <p className="truncate text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Tautan Navigasi Mobile */}
                    {navLinks.map((link: NavLink) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="border-b py-2 text-lg font-medium text-gray-700 transition-colors hover:text-blue-600"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* KONDISIONAL AUTH MOBILE */}
                    <div className="flex flex-col space-y-3 pt-4">
                        {user ? (
                            // Jika Login
                            <Button variant="outline" className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onLogout}>
                                <LogOut className="mr-2 h-4 w-4" /> Keluar
                            </Button>
                        ) : (
                            // Jika Belum Login
                            <>
                                <Button variant="outline" asChild>
                                    <Link href={login()}>Masuk</Link>
                                </Button>
                                <Button asChild>
                                    <Link href={register()}>Daftar</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
