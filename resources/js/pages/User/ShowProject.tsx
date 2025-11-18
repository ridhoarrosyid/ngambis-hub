import { Position, Project } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Calendar, Check, CheckCircle2, Edit, Mail, MapPin, Plus, Save, Share2, Trash2, Users, X } from 'lucide-react';

// Komponen UI
import { edit } from '@/actions/App/Http/Controllers/ProjectContorller';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/AppLayout';
// Jika Anda sudah generate wayfinder untuk approve/reject, import di sini.
// Jika belum, kode di bawah menggunakan URL manual string template agar tetap jalan.
import { applyPositions, approve, destroyApply, destroyProjects, reject } from '@/routes';
import React, { useState } from 'react';

interface ShowProjectProps {
    project: Project;
    isMine: boolean;
}

interface SubComponentProps {
    project: Project;
    formatDate: (dateString: string) => string;
    getInitials: (name: string) => string;
}

export default function ShowProject({ project, isMine }: ShowProjectProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const sharedProps = { project, formatDate, getInitials };

    return isMine ? <Owner {...sharedProps} /> : <NotOwner {...sharedProps} />;
}

// --- TAMPILAN PEMILIK PROJECT ---
function Owner({ project, formatDate, getInitials }: SubComponentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        responsibility: '',
        project_id: project.id,
    });

    const handleDeletePosition = (positionId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus posisi ini?')) {
            router.delete(`/positions/${positionId}`);
        }
    };

    const openCreateModal = () => {
        setEditingPosition(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (position: Position) => {
        setEditingPosition(position);
        setData({
            name: position.name,
            responsibility: position.responsibility,
            project_id: project.id,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submitPosition = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPosition) {
            put(`/positions/${editingPosition.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/positions', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    // --- PERUBAHAN DI SINI (Handle Approve/Reject) ---
    const handleUpdateStatus = (applicationId: number, newStatus: string) => {
        const actionText = newStatus === 'accepted' ? 'menerima' : 'menolak';

        if (confirm(`Apakah Anda yakin ingin ${actionText} pelamar ini?`)) {
            // Menentukan URL endpoint berdasarkan status
            // Menggunakan manual string `/approve/{id}` atau `/reject/{id}` sesuai controller
            const url = newStatus === 'accepted' ? approve(applicationId) : reject(applicationId);

            router.put(
                url,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Optional: Bisa tambahkan toast success di sini
                        console.log(`Berhasil ${actionText} pelamar`);
                    },
                },
            );
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah anda yakin ingin menghapus project ini?')) {
            router.delete(destroyProjects({ id }));
        }
    };

    return (
        <>
            <Head title={`Manage: ${project?.name}`} />

            <div className="container mx-auto min-h-screen bg-gray-50/50 px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => window.history.back()} className="cursor-pointer pl-0 transition-all hover:pl-2">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                    <Badge variant="outline" className="border-blue-500 text-blue-600">
                        Anda adalah Pemilik
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* --- KOLOM KIRI --- */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="relative max-h-64 min-h-16 overflow-hidden rounded-xl bg-white shadow-md md:max-h-96">
                            {project.image && (
                                <img
                                    src={project.image || 'https://via.placeholder.com/800x400?text=No+Image'}
                                    alt={project?.name}
                                    className="h-full w-full object-cover"
                                />
                            )}
                            <div className="absolute top-4 right-4">
                                <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm backdrop-blur">
                                    {project.positions.length} Posisi Terbuka
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{project?.name}</h1>
                            <div className="mb-6 flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Calendar className="mr-1.5 h-4 w-4" />
                                    Dibuat {formatDate(project.created_at as unknown as string)}
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="mr-1.5 h-4 w-4" />
                                    Kategori #{project.category_id}
                                </div>
                            </div>
                            <div className="prose prose-blue max-w-none leading-relaxed whitespace-pre-line text-gray-700">
                                {project.description || 'Tidak ada deskripsi proyek.'}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="flex items-center text-2xl font-bold">
                                    <CheckCircle2 className="mr-2 h-6 w-6 text-blue-600" />
                                    Manajemen Posisi
                                </h2>
                                <Button size="sm" onClick={openCreateModal}>
                                    <Plus className="mr-2 h-4 w-4" /> Tambah Posisi
                                </Button>
                            </div>

                            {project.positions.length > 0 ? (
                                <div className="grid gap-6">
                                    {project.positions.map((position) => (
                                        <Card key={position.id} className="border-l-4 border-l-blue-500 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                    <div>
                                                        <CardTitle className="text-lg text-blue-700">{position.name}</CardTitle>
                                                        <CardDescription className="mt-1 line-clamp-2">{position.responsibility}</CardDescription>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() => openEditModal(position)}
                                                            title="Edit Posisi"
                                                        >
                                                            <Edit className="h-4 w-4 text-amber-600" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="hover:border-red-200 hover:bg-red-50"
                                                            onClick={() => handleDeletePosition(position.id)}
                                                            title="Hapus Posisi"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                                                    <h4 className="mb-3 flex items-center text-sm font-bold text-gray-700">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Pelamar ({position.user_applied_list?.length || 0})
                                                    </h4>

                                                    {position.user_applied_list && position.user_applied_list.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {position.user_applied_list.map((app) => (
                                                                <div
                                                                    key={app.id}
                                                                    className="flex items-center justify-between rounded border bg-white p-3 shadow-sm"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-9 w-9 border">
                                                                            <AvatarImage src={app.user.avatar || ''} />
                                                                            <AvatarFallback className="bg-blue-50 text-xs text-blue-600">
                                                                                {getInitials(app.user.name)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">{app.user.name}</p>
                                                                            <p className="text-xs text-gray-500">{app.user.email}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`${getStatusColor(app.status)} capitalize`}
                                                                        >
                                                                            {app.status}
                                                                        </Badge>
                                                                        {app.status === 'applied' && (
                                                                            <div className="flex gap-1">
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8 cursor-pointer text-green-600 hover:bg-green-50 hover:text-green-700"
                                                                                    title="Terima"
                                                                                    onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                                                                >
                                                                                    <Check className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                                    title="Tolak"
                                                                                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-2 text-center text-sm text-gray-400 italic">
                                                            Belum ada yang melamar untuk posisi ini.
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 text-center text-gray-500">
                                    <p className="mb-4">Belum ada posisi yang dibuat.</p>
                                    <Button size="sm" variant="outline" onClick={openCreateModal}>
                                        <Plus className="mr-2 h-4 w-4" /> Buat Posisi Pertama
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (Sidebar) --- */}
                    <div className="space-y-6">
                        <Card className="border-none bg-gray-900 text-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">Menu Pemilik</CardTitle>
                                <CardDescription className="text-gray-400">Kontrol penuh atas proyek ini</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 pt-0">
                                <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700" size="lg">
                                    <Link href={edit({ id: project.id })}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit Project
                                    </Link>
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleDelete(project.id);
                                    }}
                                    variant="destructive"
                                    className="w-full border border-red-500 bg-transparent text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus Project
                                </Button>
                                <Separator className="my-2 bg-gray-700" />
                                <Button variant="secondary" className="w-full">
                                    <Share2 className="mr-2 h-4 w-4" /> Bagikan Link
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold text-gray-500 uppercase">Profil Anda</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={project.user?.avatar || ''} />
                                        <AvatarFallback>{getInitials(project.user?.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{project.user?.name}</p>
                                        <p className="text-xs text-gray-500">{project.user?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM POSISI --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingPosition ? 'Edit Posisi' : 'Tambah Posisi Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingPosition
                                ? 'Ubah detail posisi role yang dibutuhkan di sini.'
                                : 'Isi detail posisi role yang dibutuhkan untuk project ini.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitPosition} className="space-y-4 py-4">
                        <input type="hidden" value={data.project_id} />

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-right">
                                Nama Posisi / Role
                            </Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Frontend Developer"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="responsibility" className="text-right">
                                Tanggung Jawab & Syarat
                            </Label>
                            <Textarea
                                id="responsibility"
                                placeholder="Jelaskan apa yang akan dikerjakan dan syarat skill..."
                                value={data.responsibility}
                                onChange={(e) => setData('responsibility', e.target.value)}
                                className={`min-h-[120px] ${errors.responsibility ? 'border-red-500' : ''}`}
                            />
                            {errors.responsibility && <span className="text-sm text-red-500">{errors.responsibility}</span>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>Menyimpan...</>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Simpan
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// --- TAMPILAN BUKAN PEMILIK (VISITOR) ---
function NotOwner({ project, formatDate, getInitials }: SubComponentProps) {
    const handleApply = (positionId: number) => {
        router.post(
            applyPositions({ id: positionId }),
            { id: positionId },
            {
                preserveScroll: true,
                onSuccess: () => alert('Berhasil melamar posisi ini!'),
            },
        );
    };

    const handleCancelApply = (applicationId: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan lamaran ini?')) {
            router.delete(destroyApply({ id: applicationId }), { preserveScroll: true });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <>
            <Head title={project?.name} />

            <div className="container mx-auto min-h-screen bg-gray-50/50 px-4 py-10">
                {/* Header Navigasi */}
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => window.history.back()} className="pl-0 transition-all hover:pl-2">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* --- Main Content --- */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="relative max-h-64 min-h-16 overflow-hidden rounded-xl bg-white shadow-md md:max-h-96">
                            {project.image && (
                                <img
                                    src={project.image || 'https://via.placeholder.com/800x400?text=No+Image'}
                                    alt={project?.name}
                                    className="h-full w-full object-cover"
                                />
                            )}
                            <div className="absolute top-4 right-4">
                                <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm backdrop-blur">
                                    {project.positions.length} Posisi Terbuka
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{project?.name}</h1>
                            <div className="mb-6 flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Calendar className="mr-1.5 h-4 w-4" />
                                    Diposting {formatDate(project.created_at as unknown as string)}
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="mr-1.5 h-4 w-4" />
                                    Kategori #{project.category_id}
                                </div>
                            </div>
                            <div className="prose prose-blue max-w-none leading-relaxed whitespace-pre-line text-gray-700">
                                {project.description || 'Tidak ada deskripsi proyek.'}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h2 className="mb-6 flex items-center text-2xl font-bold">
                                <CheckCircle2 className="mr-2 h-6 w-6 text-blue-600" />
                                Posisi yang Dibutuhkan
                            </h2>

                            {project.positions.length > 0 ? (
                                <div className="grid gap-4">
                                    {project.positions.map((position) => {
                                        const myApplication = position.current_application;

                                        return (
                                            <Card key={position.id} className="border-l-4 border-l-blue-500 transition-shadow hover:shadow-md">
                                                <CardHeader>
                                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <CardTitle className="text-lg text-blue-700">{position.name}</CardTitle>
                                                            <CardDescription className="mt-1">Dibutuhkan segera</CardDescription>
                                                        </div>

                                                        <div>
                                                            {myApplication ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`capitalize ${getStatusColor(myApplication.status)}`}
                                                                    >
                                                                        {myApplication.status === 'applied'
                                                                            ? 'Menunggu Respon'
                                                                            : myApplication.status}
                                                                    </Badge>
                                                                    {myApplication.status === 'applied' && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                                                                            onClick={() => handleCancelApply(myApplication.id)}
                                                                        >
                                                                            Batal
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                                                    onClick={() => handleApply(position.id)}
                                                                >
                                                                    Apply Role Ini
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="mb-1 block font-semibold text-gray-800">Tanggung Jawab:</span>
                                                        {position.responsibility}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
                                    Belum ada posisi yang ditambahkan untuk proyek ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Sidebar --- */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Tentang Pembuat Project</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex items-center space-x-4">
                                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                        <AvatarImage src={project.user?.avatar || ''} />
                                        <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
                                            {getInitials(project.user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900">{project.user?.name}</p>
                                        <p className="text-xs text-gray-500">Bergabung sejak {new Date(project.user.created_at).getFullYear()}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                        {project.user.email}
                                    </div>
                                    {project.user.city && (
                                        <div className="flex items-center">
                                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                            {project.user.city}
                                        </div>
                                    )}
                                    {project.user.phone && (
                                        <div className="flex items-center">
                                            <span className="ml-6">{project.user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none bg-blue-600 text-white shadow-lg">
                            <CardContent className="pt-6">
                                <h3 className="mb-2 text-lg font-bold">Tertarik Bergabung?</h3>
                                <p className="mb-6 text-sm text-blue-100">
                                    Jangan ragu untuk menghubungi owner jika kamu memiliki skill yang sesuai.
                                </p>
                                <div className="grid gap-3">
                                    <Button className="w-full bg-white font-semibold text-blue-600 hover:bg-gray-100" size="lg">
                                        Ajukan Kolaborasi
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-blue-400 text-blue-100 hover:border-transparent hover:bg-blue-700 hover:text-white"
                                    >
                                        <Share2 className="mr-2 h-4 w-4" /> Bagikan Project
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ShowProject.layout = (page: React.ReactNode) => <AppLayout children={page} />;
