// src/components/Footer.tsx

import { Facebook, Github, Linkedin, LucideIcon, Twitter } from 'lucide-react';

// --- DEFINISI TYPE/INTERFACE ---
interface FooterLink {
    name: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    icon: LucideIcon; // Menggunakan type LucideIcon untuk ikon komponen
    href: string;
    label: string;
    hoverColor: string;
}

// Data tautan untuk footer
const footerLinks: FooterSection[] = [
    {
        title: 'Ngambishub',
        links: [
            { name: 'Tentang Kami', href: '/about' },
            { name: 'Karir', href: '/careers' },
            { name: 'Blog', href: '/blog' },
            { name: 'Kontak', href: '/contact' },
        ],
    },
    {
        title: 'Dukungan',
        links: [
            { name: 'Bantuan & FAQ', href: '/help' },
            { name: 'Ketentuan Layanan', href: '/terms' },
            { name: 'Kebijakan Privasi', href: '/privacy' },
        ],
    },
    {
        title: 'Komunitas',
        links: [
            { name: 'Project Terbaik', href: '/projects/top' },
            { name: 'Forum Diskusi', href: '/forum' },
            { name: 'Contributor', href: '/contributors' },
        ],
    },
];

// Data ikon media sosial
const socialLinks: SocialLink[] = [
    { icon: Facebook, href: '#', label: 'Facebook', hoverColor: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', hoverColor: 'hover:text-blue-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', hoverColor: 'hover:text-blue-700' },
    { icon: Github, href: '#', label: 'GitHub', hoverColor: 'hover:text-gray-900' },
];

// --- KOMPONEN UTAMA ---
export default function AppFooterLayout() {
    return (
        <footer className="mt-12 w-full border-t bg-gray-50 py-10 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-4">
                    {/* Bagian Logo dan Deskripsi Singkat */}
                    <div className="col-span-2 space-y-4 md:col-span-2">
                        <a href="/" className="text-3xl font-bold tracking-wider text-blue-600">
                            Ngambishub
                        </a>
                        <p className="max-w-sm text-sm text-gray-600">
                            Tempat berkumpulnya para pengembang ambis untuk membuat, berkolaborasi, dan memamerkan proyek terbaik.
                        </p>
                    </div>

                    {/* Bagian Tautan Navigasi */}
                    {footerLinks.map((section: FooterSection) => (
                        <div key={section.title} className="col-span-1">
                            <h3 className="text-md mb-3 font-semibold text-gray-800">{section.title}</h3>
                            <ul className="space-y-2 text-sm">
                                {section.links.map((link: FooterLink) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-gray-600 transition-colors hover:text-blue-600">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Garis Pembatas dan Hak Cipta */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                    <div className="flex flex-col justify-between md:flex-row md:items-center">
                        {/* Hak Cipta */}
                        <p className="order-2 mt-4 text-sm text-gray-500 md:order-1 md:mt-0">
                            &copy; {new Date().getFullYear()} Ngambishub. Hak Cipta Dilindungi.
                        </p>

                        {/* Ikon Media Sosial */}
                        <div className="order-1 flex space-x-4 md:order-2">
                            {socialLinks.map(
                                (
                                    { icon: Icon, href, label, hoverColor }, // Destructuring dan menggunakan alias Icon
                                ) => (
                                    <a key={label} href={href} aria-label={label}>
                                        {/* Icon digunakan sebagai Komponen React */}
                                        <Icon className={`h-5 w-5 text-gray-500 ${hoverColor} transition-colors`} />
                                    </a>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
