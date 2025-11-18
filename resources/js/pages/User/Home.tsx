import ProjectCard from '@/components/projectCard';
import TestimonialCard from '@/components/testimonialCard';
import { Button } from '@/components/ui/button';
import { dummyTestimonials } from '@/dummyData/homeData';
import AppLayout from '@/layouts/AppLayout';
import { ProjectsResponse } from '@/types';
import { Link } from '@inertiajs/react'; // Import Link
import { Briefcase, Zap } from 'lucide-react';
import React from 'react';

export default function Home({ projects }: { projects: ProjectsResponse }) {
    return (
        <div className="min-h-screen bg-white">
            <section className="border-b bg-gray-50 py-20 text-center md:py-32">
                <div className="container px-4">
                    {/* Title */}
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
                        Wadah <span className="text-blue-600">Ambisi</span> Digitalmu
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl">
                        Temukan proyek kolaboratif, bangun portofolio, dan tingkatkan *skill* coding-mu bersama komunitas Ngambishub.
                    </p>

                    {/* Button CTA */}
                    <div className="flex justify-center space-x-4">
                        <Button size="lg" className="text-lg">
                            Mulai Buat Project 🚀
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg">
                            Lihat Project Terbaru
                        </Button>
                    </div>
                </div>
            </section>

            {/* PROJECT SECTION */}
            <section className="py-16 md:py-24">
                <div className="container px-4">
                    <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">10 Proyek Paling Populer Saat Ini</h2>

                    {/* Grid Project Card */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.data.length > 0 ? (
                            projects.data.map((project) => <ProjectCard key={project.id} project={project} />)
                        ) : (
                            <div className="col-span-full text-center text-gray-500">Belum ada proyek yang tersedia saat ini.</div>
                        )}
                    </div>

                    {/* --- PAGINATION SECTION --- */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
                        {/* Info Halaman */}
                        <div className="text-sm text-gray-500">
                            Menampilkan <span className="font-medium">{projects.from}</span> sampai <span className="font-medium">{projects.to}</span>{' '}
                            dari <span className="font-medium">{projects.total}</span> proyek
                        </div>

                        {/* Tombol Navigasi */}
                        <div className="flex flex-wrap justify-center gap-1">
                            {projects.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    asChild={!!link.url} // Render sebagai Link jika URL ada
                                    disabled={!link.url} // Disable jika URL null
                                    className={`h-9 px-3 ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            // only=['projects'] // Opsional: Hanya refresh props projects agar lebih cepat
                                            preserveScroll // Opsional: Agar scroll tidak loncat ke paling atas halaman
                                            dangerouslySetInnerHTML={{ __html: link.label }} // Render label HTML (&laquo;, dll)
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-100 py-16 md:py-24">
                <div className="container px-4">
                    <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">Apa Kata Komunitas Kami?</h2>

                    {/* Grid Testimoni */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {dummyTestimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-blue-600 py-16 text-white md:py-20">
                <div className="container px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Tunggu Apa Lagi? Mulai Ngambis Sekarang!</h2>
                    <p className="mx-auto mb-10 max-w-4xl text-xl opacity-90">
                        Baik kamu punya ide brilian atau mencari tempat untuk berkontribusi, Ngambishub adalah platform-nya.
                    </p>

                    {/* Dual CTA Buttons */}
                    <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <Button size="lg" className="h-14 bg-white text-lg text-blue-600 shadow-xl hover:bg-gray-100">
                            <Zap className="mr-2 h-6 w-6" />
                            Buat Proyek Baru
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 border-white text-lg text-white hover:bg-blue-700">
                            <Briefcase className="mr-2 h-6 w-6" />
                            Cari Proyek Untuk Di-Apply
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

Home.layout = (page: React.ReactNode) => <AppLayout children={page} />;
