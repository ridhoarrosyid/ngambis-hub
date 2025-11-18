import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';

// Komponen UI Shadcn
// Pastikan import action 'show' benar. Biasanya untuk melihat detail project.
// Jika menggunakan Wayfinder, sesuaikan import-nya.
import { show } from '@/actions/App/Http/Controllers/ProjectContorller';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/AppLayout';
import React from 'react';

// --- Tipe Data Sesuai JSON Terbaru ---

interface Project {
    id: number;
    name: string;
    description: string | null;
    user_id: number;
}

interface Position {
    id: number;
    name: string;
    responsibility: string;
    project_id: number;
    project: Project; // Nested relation
    created_at: string;
}

interface ApplicationItem {
    id: number; // ID dari tabel user_applied_lists
    position_id: number;
    position: Position; // Nested relation
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
}

interface AppliedPositionsProps {
    appliedPositions: {
        current_page: number;
        data: ApplicationItem[];
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

export default function AppliedPosition({ appliedPositions }: AppliedPositionsProps) {
    // Fungsi Hapus Apply (Membatalkan lamaran)
    const handleDelete = (applicationId: number) => {
        if (confirm('Apakah anda yakin ingin membatalkan lamaran ini?')) {
            // Asumsi route backend adalah /applied-positions/{id} atau route sejenis untuk menghapus record lamaran
            router.delete(`/applied-positions/${applicationId}`);
        }
    };

    return (
        <>
            <Head title="Lamaran Saya" />

            <div className="container mx-auto px-4 py-10">
                {/* Header Halaman */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Riwayat Lamaran</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Daftar posisi pekerjaan yang telah anda lamar.</p>
                    </div>
                    {/* Tombol Buat Project dihapus karena ini halaman pelamar */}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Lamaran ({appliedPositions.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">No</TableHead>
                                        <TableHead>Posisi Dilamar</TableHead>
                                        <TableHead>Nama Project</TableHead>
                                        <TableHead>Tanggal Apply</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appliedPositions.data.length > 0 ? (
                                        appliedPositions.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center font-medium">
                                                    {/* Menghitung nomor urut */}
                                                    {(appliedPositions.current_page - 1) * appliedPositions.per_page + (index + 1)}
                                                </TableCell>

                                                {/* Nama Posisi */}
                                                <TableCell className="font-medium text-blue-600">{item.position?.name || 'Posisi Dihapus'}</TableCell>

                                                {/* Nama Project */}
                                                <TableCell>{item.position?.project?.name || 'Project Dihapus'}</TableCell>

                                                {/* Tanggal Apply */}
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(item.position.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Tombol Lihat Detail Project */}
                                                        {item.position?.project && (
                                                            <Button variant="outline" size="icon" asChild title="Lihat Project">
                                                                <Link href={show({ id: item.position.project.id })}>
                                                                    <Eye className="h-4 w-4 text-blue-600" />
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        {/* Tombol Hapus Apply (Batalkan) */}
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="hover:border-red-200 hover:bg-red-50"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Batalkan Lamaran"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                                Anda belum melamar posisi apapun.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* --- Pagination Section --- */}
                        <div className="mt-5 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {appliedPositions.from} sampai {appliedPositions.to} dari {appliedPositions.total} data
                            </div>
                            <div className="flex items-center space-x-1">
                                {appliedPositions.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        asChild={!!link.url}
                                        disabled={!link.url}
                                        className={`h-8 px-3 ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {link.url ? (
                                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
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

AppliedPosition.layout = (page: React.ReactNode) => <AppLayout children={page} />;
