import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

// Komponen UI Shadcn
import { create, edit, show } from '@/actions/App/Http/Controllers/ProjectContorller';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/AppLayout';
import { destroyProjects } from '@/routes';
import React from 'react';

// --- Tipe Data Sesuai JSON ---

interface ProjectItem {
    id: number;
    name: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
}

interface MyProjectsProps {
    projects: {
        current_page: number;
        data: ProjectItem[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: PaginationLink[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export default function MyProjects({ projects }: MyProjectsProps) {
    // Fungsi Delete
    const handleDelete = (id: number) => {
        if (confirm('Apakah anda yakin ingin menghapus project ini?')) {
            router.delete(destroyProjects({ id })); // Sesuaikan dengan route delete kamu
        }
    };

    return (
        <>
            <Head title="Project Saya" />

            <div className="container mx-auto px-4 py-10">
                {/* Header Halaman */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Project Saya</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola semua project yang telah anda buat.</p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="mr-2 h-4 w-4" /> Buat Project Baru
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Project ({projects.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">No</TableHead>
                                        <TableHead>Nama Project</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.data.length > 0 ? (
                                        projects.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center font-medium">
                                                    {/* Menghitung nomor urut berdasarkan halaman */}
                                                    {(projects.current_page - 1) * projects.per_page + (index + 1)}
                                                </TableCell>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Tombol Lihat (Desktop) */}
                                                        <Button variant="outline" size="icon" asChild className="hidden sm:inline-flex">
                                                            <Link href={show({ id: item.id })}>
                                                                <Eye className="h-4 w-4 text-blue-600" />
                                                            </Link>
                                                        </Button>

                                                        {/* Tombol Edit (Desktop) */}
                                                        <Button variant="outline" size="icon" asChild className="hidden sm:inline-flex">
                                                            <Link href={edit({ id: item.id })}>
                                                                <Edit className="h-4 w-4 text-amber-600" />
                                                            </Link>
                                                        </Button>

                                                        {/* Tombol Hapus (Desktop) */}
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="hidden hover:border-red-200 hover:bg-red-50 sm:inline-flex"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>

                                                        {/* Dropdown Menu untuk Mobile (Responsive) */}
                                                        <div className="sm:hidden">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">Open menu</span>
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/projects/${item.id}`}>Lihat Detail</Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/projects/${item.id}/edit`}>Edit Project</Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDelete(item.id)}
                                                                        className="text-red-600 focus:text-red-600"
                                                                    >
                                                                        Hapus Project
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                                                Belum ada project yang dibuat.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* --- Pagination Section --- */}
                        <div className="mt-5 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {projects.from} sampai {projects.to} dari {projects.total} data
                            </div>
                            <div className="flex items-center space-x-1">
                                {projects.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        asChild={!!link.url} // Render as child only if URL exists
                                        disabled={!link.url}
                                        className={`h-8 px-3 ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                // Menggunakan dangerouslySetInnerHTML untuk merender &laquo; / &raquo;
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MyProjects.layout = (page: React.ReactNode) => <AppLayout children={page} />;
